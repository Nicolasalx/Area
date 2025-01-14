import { Test, TestingModule } from '@nestjs/testing';
import { OpenskyActionService } from './opensky.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { ActionService } from '@action-service/action/action.service';

describe('OpenskyActionService', () => {
  let service: OpenskyActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [OpenskyActionService, ActionService],
    }).compile();

    service = module.get<OpenskyActionService>(OpenskyActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
