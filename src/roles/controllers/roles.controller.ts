import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesDecorator } from 'src/auth/decorators/roles.decorator';
import { Roles } from '../enums/roles.enum';
@Controller('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RolesDecorator(Roles.SuperAdmin)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RolesDecorator(Roles.SuperAdmin)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }
}
