import { Test, TestingModule } from '@nestjs/testing';
import { TimerService } from './timer.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [TimerService, ActionService],
    }).compile();

    service = module.get<TimerService>(TimerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
