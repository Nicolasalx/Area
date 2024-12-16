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

describe('TriggerService', () => {
  let service: TriggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [
        TriggerService,
        {
          provide: ActionService,
          useValue: { executeReactions: jest.fn() },
        },
        {
          provide: GithubActionService,
          useValue: {
            handleGithubPush: jest.fn(),
            handleNewBranch: jest.fn(),
            handleNewPullRequest: jest.fn(),
          },
        },
        {
          provide: GoogleActionService,
          useValue: {
            receiveNewEmail: jest.fn(),
            newCalendarEvent: jest.fn(),
            newTask: jest.fn(),
            newPlaylistYoutube: jest.fn(),
            newDriveElement: jest.fn(),
          },
        },
        {
          provide: TimerActionService,
          useValue: { handleTimerAction: jest.fn() },
        },
        {
          provide: CronActionService,
          useValue: { handleCronAction: jest.fn() },
        },
        {
          provide: RssActionService,
          useValue: { handleRssFeed: jest.fn() },
        },

        GithubActionHandler,
        GoogleActionHandler,
        SchedulerActionHandler,
        RssActionHandler,

        {
          provide: SchedulerRegistry,
          useValue: {
            addCronJob: jest.fn(),
            deleteCronJob: jest.fn(),
            addTimeout: jest.fn(),
            deleteTimeout: jest.fn(),
            doesExist: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TriggerService>(TriggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
