import { Test, TestingModule } from '@nestjs/testing';
import { TimerActionService } from './timer.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('TimerActionService', () => {
  let service: TimerActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [TimerActionService, ActionService],
    }).compile();

    service = module.get<TimerActionService>(TimerActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
