import { Test, TestingModule } from '@nestjs/testing';
import { GoogleActionService } from './google.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('GoogleActionService', () => {
  let service: GoogleActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [GoogleActionService, ActionService],
    }).compile();

    service = module.get<GoogleActionService>(GoogleActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
