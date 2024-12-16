import { Test, TestingModule } from '@nestjs/testing';
import { ReactionService } from './reaction.service';
import { GoogleReactionService } from '../google/google.service';
import { DiscordReactionService } from '../discord/discord.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('ReactionService', () => {
  let service: ReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionService,
        {
          provide: GoogleReactionService,
          useValue: {},
        },
        {
          provide: DiscordReactionService,
          useValue: {},
        },
      ],
      imports: [PrismaServiceModule],
    }).compile();

    service = module.get<ReactionService>(ReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
