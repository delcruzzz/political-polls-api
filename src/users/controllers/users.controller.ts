import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesDecorator } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/roles/enums/roles.enum';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RolesDecorator(Roles.SuperAdmin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RolesDecorator(Roles.SuperAdmin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RolesDecorator(Roles.SuperAdmin)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @RolesDecorator(Roles.SuperAdmin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
