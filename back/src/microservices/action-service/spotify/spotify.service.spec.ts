import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyActionService } from './spotify.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { ActionService } from '@action-service/action/action.service';

describe('SpotifyActionService', () => {
  let service: SpotifyActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [SpotifyActionService, ActionService],
    }).compile();

    service = module.get<SpotifyActionService>(SpotifyActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
