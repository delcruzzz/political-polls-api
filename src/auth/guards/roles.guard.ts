import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!validRoles || validRoles.length === 0) return false;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user)
      throw new HttpException(
        { message: 'notFoundRoles' },
        HttpStatus.NOT_FOUND,
      );

    for (const role of user.roles) {
      if (validRoles.includes(role.name)) return true;
    }

    throw new HttpException({ message: 'invalidRoles' }, HttpStatus.FORBIDDEN);
  }
}
