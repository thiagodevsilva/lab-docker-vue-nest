import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class RegistrosService {
  constructor(private prisma: PrismaService) {}

  private canAccess(userId: string, userRole: string, ownerId: string): boolean {
    if (userRole === 'ADMIN') return true;
    return userId === ownerId;
  }

  async create(
    dto: CreateRegistroDto,
    ownerId: string,
  ) {
    return this.prisma.registro.create({
      data: {
        ...dto,
        ownerId,
      },
    });
  }

  async findAll(
    userId: string,
    userRole: string,
    page = 1,
    limit = 10,
    status?: Status,
    search?: string,
  ): Promise<PaginatedResult<unknown>> {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (userRole !== 'ADMIN') {
      where.ownerId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (search && search.trim()) {
      where.OR = [
        { nome: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.registro.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.registro.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string, userRole: string) {
    const registro = await this.prisma.registro.findUnique({
      where: { id },
    });
    if (!registro) {
      throw new NotFoundException('Registro não encontrado');
    }
    if (!this.canAccess(userId, userRole, registro.ownerId)) {
      throw new ForbiddenException('Acesso negado');
    }
    return registro;
  }

  async update(
    id: string,
    dto: UpdateRegistroDto,
    userId: string,
    userRole: string,
  ) {
    await this.findOne(id, userId, userRole);
    return this.prisma.registro.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Apenas admin pode excluir registros');
    }
    const registro = await this.prisma.registro.findUnique({
      where: { id },
    });
    if (!registro) {
      throw new NotFoundException('Registro não encontrado');
    }
    return this.prisma.registro.delete({
      where: { id },
    });
  }

  async countByStatus(userId: string, userRole: string) {
    const where: Record<string, unknown> = {};
    if (userRole !== 'ADMIN') {
      where.ownerId = userId;
    }

    const [total, pendentes, emAndamento, concluidos] = await Promise.all([
      this.prisma.registro.count({ where }),
      this.prisma.registro.count({
        where: { ...where, status: Status.PENDENTE },
      }),
      this.prisma.registro.count({
        where: { ...where, status: Status.EM_ANDAMENTO },
      }),
      this.prisma.registro.count({
        where: { ...where, status: Status.CONCLUIDO },
      }),
    ]);

    return { total, pendentes, emAndamento, concluidos };
  }
}
