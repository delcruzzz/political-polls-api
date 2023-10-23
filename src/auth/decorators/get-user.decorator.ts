import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user)
    throw new HttpException(
      { message: 'internalServerError' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  return !data ? user : user[data];
});
