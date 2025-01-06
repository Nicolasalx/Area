import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtConfigModule } from '../../shared/jwt/jwt-config.module';
import { OAuthModule } from '../oauth/oauth.module';

@Module({
  imports: [PrismaServiceModule, JwtConfigModule, OAuthModule],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtConfigModule],
})
export class AuthModule {}
