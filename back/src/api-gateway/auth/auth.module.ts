import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserServiceModule } from '@userService/user-service.module';

@Module({
  imports: [HttpModule, UserServiceModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
