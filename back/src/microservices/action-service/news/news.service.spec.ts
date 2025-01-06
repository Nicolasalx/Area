import { Test, TestingModule } from '@nestjs/testing';
import { NewsActionService } from './news.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('NewsActionService', () => {
  let service: NewsActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [NewsActionService, ActionService],
    }).compile();

    service = module.get<NewsActionService>(NewsActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
