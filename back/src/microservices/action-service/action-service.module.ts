import { Module } from '@nestjs/common';
import { ActionService } from './action/action.service';
import { ActionController } from './action/action.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

@Module({
  imports: [PrismaServiceModule],
  providers: [ActionService],
  controllers: [ActionController],
})
export class ActionServiceModule {}
