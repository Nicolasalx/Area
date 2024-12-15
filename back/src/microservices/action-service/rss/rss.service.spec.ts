import { Test, TestingModule } from '@nestjs/testing';
import { RssActionService } from './rss.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('RssActionService', () => {
  let service: RssActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [RssActionService, ActionService],
    }).compile();

    service = module.get<RssActionService>(RssActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
