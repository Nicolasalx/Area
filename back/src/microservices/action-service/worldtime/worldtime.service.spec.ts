import { Test, TestingModule } from '@nestjs/testing';
import { WorldTimeActionService } from './worldtime.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('WorldTimeActionService', () => {
  let service: WorldTimeActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [WorldTimeActionService, ActionService],
    }).compile();

    service = module.get<WorldTimeActionService>(WorldTimeActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
