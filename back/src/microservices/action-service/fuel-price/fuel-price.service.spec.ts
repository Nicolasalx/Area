import { Test, TestingModule } from '@nestjs/testing';
import { FuelPriceActionService } from './fuel-price.service';

describe('FuelPriceActionService', () => {
  let service: FuelPriceActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelPriceActionService],
    }).compile();

    service = module.get<FuelPriceActionService>(FuelPriceActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
