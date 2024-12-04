import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [HttpModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
