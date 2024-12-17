import { Test, TestingModule } from '@nestjs/testing';
import { SlackReactionService } from './slack.service';

describe('SlackReactionService', () => {
  let service: SlackReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackReactionService],
    }).compile();

    service = module.get<SlackReactionService>(SlackReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
