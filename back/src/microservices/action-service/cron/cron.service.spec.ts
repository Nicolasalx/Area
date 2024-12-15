import { Test, TestingModule } from '@nestjs/testing';
import { CronActionService } from './cron.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('CronActionService', () => {
  let service: CronActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [CronActionService, ActionService],
    }).compile();

    service = module.get<CronActionService>(CronActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
