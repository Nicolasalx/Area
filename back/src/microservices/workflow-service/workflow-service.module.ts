import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow/workflow.controller';
import { WorkflowService } from './workflow/workflow.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { SharedAuthModule } from '../../shared/auth/auth.module';

@Module({
  imports: [PrismaServiceModule, SharedAuthModule],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowServiceModule {}
