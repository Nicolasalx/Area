import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';
import { UserServiceModule } from './microservices/user-service/user-service.module';
import { TriggerServiceModule } from './microservices/trigger-service/trigger-service.module';
import { ActionServiceModule } from './microservices/action-service/action-service.module';
import { WorkflowServiceModule } from './microservices/workflow-service/workflow-service.module';
import { PrismaController } from './microservices/prisma-service/prisma/prisma.controller';
import { PrismaServiceModule } from './microservices/prisma-service/prisma-service.module';
import { ReactionServiceModule } from './microservices/reaction-service/reaction-service.module';

@Module({
  imports: [
    ApiGatewayModule,
    UserServiceModule,
    TriggerServiceModule,
    ActionServiceModule,
    WorkflowServiceModule,
    PrismaServiceModule,
    ReactionServiceModule
  ],
  controllers: [AppController, PrismaController],
  providers: [AppService],
})
export class AppModule {}
