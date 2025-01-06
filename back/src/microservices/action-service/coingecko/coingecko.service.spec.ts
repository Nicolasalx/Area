import { Test, TestingModule } from '@nestjs/testing';
import { CoingeckoActionService } from './coingecko.service';

describe('CoingeckoActionService', () => {
  let service: CoingeckoActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoingeckoActionService],
    }).compile();

    service = module.get<CoingeckoActionService>(CoingeckoActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
