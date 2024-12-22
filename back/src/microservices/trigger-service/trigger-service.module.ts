import { Module } from '@nestjs/common';
import { TriggerService } from './trigger/trigger.service';
import { TriggerController } from './trigger/trigger.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { ScheduleModule } from '@nestjs/schedule';

import { ActionService } from '@action-service/action/action.service';
import { GithubActionService } from '@action-service/github/github.service';
import { GoogleActionService } from '@action-service/google/google.service';
import { TimerActionService } from '@action-service/timer/timer.service';
import { CronActionService } from '@action-service/cron/cron.service';
import { RssActionService } from '@action-service/rss/rss.service';
import { TodoistActionService } from '@action-service/todoist/todoist.service';

import { GithubActionHandler } from './handler/github.handler';
import { GoogleActionHandler } from './handler/google.handler';
import { SchedulerActionHandler } from './handler/sheduler.handler';
import { RssActionHandler } from './handler/rss.handler';
import { SlackActionService } from '@action-service/slack/slack.service';
import { SlackActionHandler } from './handler/slack.handler';
import { TrelloActionService } from '@action-service/trello/trello.service';
import { TrelloActionHandler } from './handler/trello.handler';
import { TodoistActionHandler } from './handler/todoist.handler';

@Module({
  imports: [PrismaServiceModule, ScheduleModule.forRoot()],
  providers: [
    TriggerService,

    ActionService,
    GithubActionService,
    GoogleActionService,
    TimerActionService,
    CronActionService,
    RssActionService,
    SlackActionService,
    TrelloActionService,
    TodoistActionService,

    GithubActionHandler,
    GoogleActionHandler,
    SchedulerActionHandler,
    RssActionHandler,
    SlackActionHandler,
    TrelloActionHandler,
    TodoistActionHandler,
  ],
  controllers: [TriggerController],
})
export class TriggerServiceModule {}
