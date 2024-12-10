import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserServiceModule } from '@userService/user-service.module';
import { JwtConfigModule } from '../../shared/jwt/jwt-config.module';

@Module({
  imports: [
    HttpModule,
    UserServiceModule,
    PrismaServiceModule,
    JwtConfigModule,
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtConfigModule],
})
export class AuthModule {}
