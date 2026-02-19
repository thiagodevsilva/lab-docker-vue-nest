import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { RegistrosService } from './registros.service';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}
import { Status } from '@prisma/client';

@Controller('registros')
@UseGuards(JwtAuthGuard)
export class RegistrosController {
  constructor(private readonly registrosService: RegistrosService) {}

  @Post()
  create(
    @Body() createRegistroDto: CreateRegistroDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrosService.create(createRegistroDto, user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: Status,
    @Query('search') search?: string,
  ) {
    return this.registrosService.findAll(
      user.id,
      user.role,
      page,
      limit,
      status,
      search,
    );
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.registrosService.countByStatus(user.id, user.role);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrosService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegistroDto: UpdateRegistroDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrosService.update(id, updateRegistroDto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrosService.remove(id, user.id, user.role);
  }
}
