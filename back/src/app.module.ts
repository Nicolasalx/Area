import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';
import { UserServiceModule } from './microservices/user-service/user-service.module';
import { TriggerServiceModule } from './microservices/trigger-service/trigger-service.module';
import { ActionServiceModule } from './microservices/action-service/action-service.module';
import { WorkflowServiceModule } from './microservices/workflow-service/workflow-service.module';
import { PrismaController } from './microservices/prisma-service/prisma/prisma.controller';
import { PrismaServiceModule } from './microservices/prisma-service/prisma-service.module';
import { ReactionServiceModule } from './microservices/reaction-service/reaction-service.module';
import { AboutModule } from './microservices/about-service/about.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiGatewayModule,
    UserServiceModule,
    TriggerServiceModule,
    ActionServiceModule,
    WorkflowServiceModule,
    PrismaServiceModule,
    ReactionServiceModule,
    AboutModule,
  ],
  controllers: [PrismaController],
})
export class AppModule {}
