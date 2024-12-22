import { Test, TestingModule } from '@nestjs/testing';
import { TrelloReactionService } from './trello.service';

describe('TrelloReactionService', () => {
  let service: TrelloReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrelloReactionService],
    }).compile();

    service = module.get<TrelloReactionService>(TrelloReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
