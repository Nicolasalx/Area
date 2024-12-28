import { Test, TestingModule } from '@nestjs/testing';
import { OpenweatherActionService } from '@action-service/openweather/openweather.service';
import { ActionService } from '@action-service/action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('OpenweatherActionService', () => {
  let service: OpenweatherActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [OpenweatherActionService, ActionService],
    }).compile();

    service = module.get<OpenweatherActionService>(OpenweatherActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
