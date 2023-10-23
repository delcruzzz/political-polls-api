import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  identityCard: string;

  @IsString()
  @MinLength(6)
  password: string;
}
