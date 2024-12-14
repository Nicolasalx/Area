import { Test, TestingModule } from '@nestjs/testing';
import { RssService } from './rss.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('RssService', () => {
  let service: RssService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [RssService, ActionService],
    }).compile();

    service = module.get<RssService>(RssService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
