import { Test, TestingModule } from '@nestjs/testing';
import { EarthquakeAlertsActionService } from './earthquake-alerts.service';
import { ActionService } from '@action-service/action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('EarthquakeAlertsActionService', () => {
  let service: EarthquakeAlertsActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [EarthquakeAlertsActionService, ActionService],
    }).compile();

    service = module.get<EarthquakeAlertsActionService>(
      EarthquakeAlertsActionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
