import { Test, TestingModule } from '@nestjs/testing';
import { FuelPriceActionService } from './fuel-price.service';
import { ActionService } from '@action-service/action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('FuelPriceActionService', () => {
  let service: FuelPriceActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [FuelPriceActionService, ActionService],
    }).compile();

    service = module.get<FuelPriceActionService>(FuelPriceActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
