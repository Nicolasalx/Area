import { Test, TestingModule } from '@nestjs/testing';
import { TriggerService } from './trigger.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { GithubService } from '../../action-service/github/github.service';
import { ActionService } from '../../action-service/action/action.service';
import { TimerService } from '../../action-service/timer/timer.service';
import { GoogleActionService } from '../../action-service/google/google.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronService } from '../../action-service/cron/cron.service';

describe('TriggerService', () => {
  let service: TriggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TriggerService,
        GithubService,
        ActionService,
        TimerService,
        GoogleActionService,
        SchedulerRegistry,
        CronService
      ],
      imports: [PrismaServiceModule],
    }).compile();

    service = module.get<TriggerService>(TriggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
