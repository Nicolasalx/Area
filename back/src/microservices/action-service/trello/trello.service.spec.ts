import { Test, TestingModule } from '@nestjs/testing';
import { TrelloActionService } from './trello.service';

describe('TrelloService', () => {
  let service: TrelloActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrelloActionService],
    }).compile();

    service = module.get<TrelloActionService>(TrelloActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
