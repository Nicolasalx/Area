import { Test, TestingModule } from '@nestjs/testing';
import { ReactionService } from './reaction.service';
import { GoogleReactionService } from '../google/google.service';
import { DiscordReactionService } from '../discord/discord.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { SlackReactionService } from '@reaction-service/slack/slack.service';
import { TrelloReactionService } from '@reaction-service/trello/trello.service';
import { TodoistReactionService } from '@reaction-service/todoist/todoist.service';
import { TwilioReactionService } from '@reaction-service/twilio/twilio.service';
import { SpotifyReactionService } from '@reaction-service/spotify/spotify.service';

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
        {
          provide: SlackReactionService,
          useValue: {},
        },
        {
          provide: TodoistReactionService,
          useValue: {},
        },
        {
          provide: TrelloReactionService,
          useValue: {},
        },
        {
          provide: TwilioReactionService,
          useValue: {},
        },
        {
          provide: SpotifyReactionService,
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
