import { Test, TestingModule } from '@nestjs/testing';
import { ReactionService } from './reaction.service';
import { GoogleService } from '../google/google.service';
import { DiscordService } from '../discord/discord.service';

describe('ReactionService', () => {
  let service: ReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionService,
        {
          provide: GoogleService,
          useValue: {},
        },
        {
          provide: DiscordService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReactionService>(ReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
