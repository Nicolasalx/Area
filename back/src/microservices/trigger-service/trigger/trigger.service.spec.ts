import { Test, TestingModule } from '@nestjs/testing';
import { TriggerService } from '@trigger-service/trigger/trigger.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { GithubActionService } from '@action-service/github/github.service';
import { ActionService } from '@action-service/action/action.service';
import { TimerActionService } from '@action-service/timer/timer.service';
import { GoogleActionService } from '@action-service/google/google.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronActionService } from '@action-service/cron/cron.service';
import { RssActionService } from '@action-service/rss/rss.service';

describe('TriggerService', () => {
  let service: TriggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TriggerService,
        GithubActionService,
        ActionService,
        TimerActionService,
        GoogleActionService,
        SchedulerRegistry,
        CronActionService,
        RssActionService,
      ],
      imports: [PrismaServiceModule],
    }).compile();

    service = module.get<TriggerService>(TriggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
