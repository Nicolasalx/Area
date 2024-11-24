import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow/workflow.service';
import { WorkflowController } from './workflow/workflow.controller';

@Module({
  providers: [WorkflowService],
  controllers: [WorkflowController]
})
export class WorkflowServiceModule {}
