import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyActionService } from './spotify.service';

describe('SpotifyActionService', () => {
  let service: SpotifyActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyActionService],
    }).compile();

    service = module.get<SpotifyActionService>(SpotifyActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
