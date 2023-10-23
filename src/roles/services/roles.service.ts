import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    return await this.roleRepository.find({
      select: ['id', 'name'],
      relations: ['users'],
    });
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      select: ['id', 'name'],
      relations: ['users'],
    });

    if (!role)
      throw new HttpException({ message: 'notFound' }, HttpStatus.NOT_FOUND);
    return role;
  }
}
