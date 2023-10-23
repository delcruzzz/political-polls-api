import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { duplicateErrorKey } from 'src/common/constants';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private readonly logger = new Logger('UsersService');

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    const passwordEncripted = await bcrypt.hash(user.password, 10);
    user.password = passwordEncripted;

    try {
      if (createUserDto.rolesId) {
        const roles = await this.roleRepository.findBy({
          id: In(createUserDto.rolesId),
        });
        user.roles = roles;
      }

      return await this.userRepository.save(user);
    } catch (error: any) {
      if (error.code === duplicateErrorKey)
        throw new HttpException(
          { message: 'duplicateErrorKey' },
          HttpStatus.BAD_REQUEST,
        );

      this.logger.error(error);
      throw new HttpException(
        { message: 'internalServerError' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .select([
        'user.id',
        'user.name',
        'user.cellPhoneNumber',
        'user.identityCard',
        'roles.id',
        'roles.name',
      ])
      .getMany();
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .select([
        'user.id',
        'user.name',
        'user.cellPhoneNumber',
        'user.identityCard',
        'roles.id',
        'roles.name',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!user)
      throw new HttpException({ message: 'notFound' }, HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user)
      throw new HttpException({ message: 'notFound' }, HttpStatus.NOT_FOUND);

    try {
      if (updateUserDto.password) {
        const passwordEncripted = await bcrypt.hash(user.password, 10);
        user.password = passwordEncripted;
      }
      if (updateUserDto.rolesId) {
        const roles = await this.roleRepository.findBy({
          id: In(updateUserDto.rolesId),
        });
        user.roles = roles;
      }

      return await this.userRepository.save(user);
    } catch (error: any) {
      if (error.code === duplicateErrorKey)
        throw new HttpException(
          { message: 'duplicateErrorKey' },
          HttpStatus.BAD_REQUEST,
        );

      throw new HttpException(
        { message: 'internalServerError' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
