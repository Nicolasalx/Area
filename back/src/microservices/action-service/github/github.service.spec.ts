import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

jest.mock('../action/action.service');

describe('GithubService', () => {
  let service: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [GithubService, ActionService],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
