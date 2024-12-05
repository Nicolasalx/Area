import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow/workflow.service';
import { WorkflowController } from './workflow/workflow.controller';
import { PrismaService } from '@prismaService/prisma/prisma.service';

@Module({
  providers: [WorkflowService, PrismaService],
  controllers: [WorkflowController],
})
export class WorkflowServiceModule {}
