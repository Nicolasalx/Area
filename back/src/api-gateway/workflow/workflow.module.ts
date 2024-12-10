import { Module } from '@nestjs/common';
import { WorkflowController } from '../../microservices/workflow-service/workflow/workflow.controller';
import { WorkflowService } from '../../microservices/workflow-service/workflow/workflow.service';
import { PrismaServiceModule } from '../../microservices/prisma-service/prisma-service.module';
import { SharedAuthModule } from '../../shared/auth/auth.module';

@Module({
  imports: [PrismaServiceModule, SharedAuthModule],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowGatewayModule {}
