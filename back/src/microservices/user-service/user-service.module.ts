import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { SharedAuthModule } from '../../shared/auth/auth.module';

@Module({
  imports: [PrismaServiceModule, SharedAuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserServiceModule {}
