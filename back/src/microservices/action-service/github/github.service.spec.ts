import { Test, TestingModule } from '@nestjs/testing';
import { GithubActionService } from './github.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

jest.mock('../action/action.service');

describe('GithubActionService', () => {
  let service: GithubActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [GithubActionService, ActionService],
    }).compile();

    service = module.get<GithubActionService>(GithubActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
