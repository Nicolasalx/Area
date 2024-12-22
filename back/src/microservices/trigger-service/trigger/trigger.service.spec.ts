import { Test, TestingModule } from '@nestjs/testing';
import { TriggerService } from './trigger.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { SchedulerRegistry } from '@nestjs/schedule';

import { GithubActionService } from '@action-service/github/github.service';
import { ActionService } from '@action-service/action/action.service';
import { TimerActionService } from '@action-service/timer/timer.service';
import { GoogleActionService } from '@action-service/google/google.service';
import { CronActionService } from '@action-service/cron/cron.service';
import { RssActionService } from '@action-service/rss/rss.service';

import { GithubActionHandler } from '@trigger-service/handler/github.handler';
import { GoogleActionHandler } from '@trigger-service/handler/google.handler';
import { SchedulerActionHandler } from '@trigger-service/handler/sheduler.handler';
import { RssActionHandler } from '@trigger-service/handler/rss.handler';
import { SlackActionHandler } from '@trigger-service/handler/slack.handler';
import { SlackActionService } from '@action-service/slack/slack.service';
import { TrelloActionService } from '@action-service/trello/trello.service';
import { TrelloActionHandler } from '@trigger-service/handler/trello.handler';

describe('TriggerService', () => {
  let service: TriggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [
        TriggerService,
        {
          provide: ActionService,
          useValue: {},
        },
        {
          provide: GithubActionService,
          useValue: {},
        },
        {
          provide: GoogleActionService,
          useValue: {},
        },
        {
          provide: TimerActionService,
          useValue: {},
        },
        {
          provide: CronActionService,
          useValue: {},
        },
        {
          provide: RssActionService,
          useValue: {},
        },
        {
          provide: SlackActionService,
          useValue: {},
        },
        {
          provide: TrelloActionService,
          useValue: {},
        },

        GithubActionHandler,
        GoogleActionHandler,
        SchedulerActionHandler,
        RssActionHandler,
        SlackActionHandler,
        TrelloActionHandler,

        {
          provide: SchedulerRegistry,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TriggerService>(TriggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
