import { Module } from '@nestjs/common';
import { TriggerService } from './trigger/trigger.service';
import { TriggerController } from './trigger/trigger.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { GithubService } from '../action-service/github/github.service';
import { GoogleService } from '../reaction-service/google/google.service';
import { ActionService } from '../action-service/action/action.service';
import { TimerService } from '../action-service/timer/timer.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GoogleActionService } from '../action-service/google/google.service';
import { CronService } from '../action-service/cron/cron.service';

@Module({
  imports: [PrismaServiceModule, ScheduleModule.forRoot()],
  providers: [
    TriggerService,
    GithubService,
    ActionService,
    GoogleService,
    TimerService,
    CronService,
    GoogleActionService,
  ],
  controllers: [TriggerController],
})
export class TriggerServiceModule {}
