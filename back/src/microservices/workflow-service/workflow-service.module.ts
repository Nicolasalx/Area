import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow/workflow.controller';
import { WorkflowService } from './workflow/workflow.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { SharedAuthModule } from '../../shared/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PrismaServiceModule, SharedAuthModule, EventEmitterModule.forRoot({
    wildcard: true,
    delimiter: '.',
  })
  ],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowServiceModule { }
