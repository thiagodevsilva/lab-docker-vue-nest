import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RegistrosModule } from './registros/registros.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, RegistrosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
