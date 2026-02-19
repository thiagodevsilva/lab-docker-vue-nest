import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateRegistroDto {
  @IsString()
  @MinLength(2)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  telefone: string;

  @IsEnum(Status)
  status: Status;
}
