import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .select([
        'user.id',
        'user.name',
        'user.password',
        'user.identityCard',
        'roles.name',
      ])
      .where('user.id = :id', { id })
      .getOne();

    try {
      return user;
    } catch (error) {
      if (!user) {
        throw new HttpException(
          { message: 'unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}
