import { Test, TestingModule } from '@nestjs/testing';
import { CoingeckoActionService } from './coingecko.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { ActionService } from '@action-service/action/action.service';

describe('CoingeckoActionService', () => {
  let service: CoingeckoActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [CoingeckoActionService, ActionService],
    }).compile();

    service = module.get<CoingeckoActionService>(CoingeckoActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
