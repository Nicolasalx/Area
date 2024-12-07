import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserServiceModule } from '@userService/user-service.module';

@Module({
  imports: [
    HttpModule,
    UserServiceModule,
    PrismaServiceModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
