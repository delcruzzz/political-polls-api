import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsPhoneNumber,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(4)
  @IsPhoneNumber('CO')
  cellPhoneNumber: string;

  @IsString()
  @MinLength(6)
  identityCard: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  rolesId: number[];
}
