import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyReactionService } from './spotify.service';

describe('SpotifyReactionService', () => {
  let service: SpotifyReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyReactionService],
    }).compile();

    service = module.get<SpotifyReactionService>(SpotifyReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
