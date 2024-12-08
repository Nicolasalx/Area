import { Module } from '@nestjs/common';
import { TriggerService } from './trigger/trigger.service';
import { TriggerController } from './trigger/trigger.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { GithubService } from '../action-service/github/github.service';
import { GoogleService } from '../reaction-service/google/google.service';
import { ActionService } from '../action-service/action/action.service';

@Module({
  imports: [PrismaServiceModule],
  providers: [TriggerService, GithubService, ActionService, GoogleService],
  controllers: [TriggerController],
})
export class TriggerServiceModule {}
