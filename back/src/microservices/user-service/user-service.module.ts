import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

@Module({
  imports: [PrismaServiceModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserServiceModule {}
