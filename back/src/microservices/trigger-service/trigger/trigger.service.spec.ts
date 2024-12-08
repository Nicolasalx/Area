import { Test, TestingModule } from '@nestjs/testing';
import { TriggerService } from './trigger.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { GithubService } from '../../action-service/github/github.service';
import { ActionService } from '../../action-service/action/action.service';

describe('TriggerService', () => {
  let service: TriggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TriggerService, GithubService, ActionService],
      imports: [PrismaServiceModule],
    }).compile();

    service = module.get<TriggerService>(TriggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
