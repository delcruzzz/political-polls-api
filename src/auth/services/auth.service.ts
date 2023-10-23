import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger('AuthService');

  async login(loginUserDto: LoginUserDto) {
    const { identityCard, password } = loginUserDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .select([
        'user.id',
        'user.name',
        'user.identityCard',
        'user.cellPhoneNumber',
        'user.password',
        'roles.name',
      ])
      .where('user.identityCard = :identityCard', { identityCard })
      .getOne();

    try {
      if (!user)
        throw new HttpException(
          { message: 'unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch)
        throw new HttpException(
          { message: 'unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );

      return {
        id: user.id,
        name: user.name,
        identityCard: user.identityCard,
        cellPhoneNumber: user.cellPhoneNumber,
        roles: user.roles,
        token: this.getJwtToken({
          id: user.id,
          name: user.name,
          roles: user.roles.map((role) => role.name),
        }),
      };
    } catch (error) {
      if (!(user && bcrypt.compareSync(password, user.password)))
        throw new HttpException(
          { message: 'unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      this.logger.error(error);
    }
  }

  getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
