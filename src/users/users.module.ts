import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesController } from 'src/roles/controllers/roles.controller';
import { RolesService } from 'src/roles/services/roles.service';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  controllers: [UsersController, RolesController],
  providers: [UsersService, RolesService],
  imports: [TypeOrmModule.forFeature([User, Role])],
})
export class UsersModule {}
