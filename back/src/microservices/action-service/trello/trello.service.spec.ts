import { Test, TestingModule } from '@nestjs/testing';
import { TrelloActionService } from './trello.service';
import { ActionService } from '@action-service/action/action.service';

const mockActionService = {
  someMethod: jest.fn(),
};

describe('TrelloService', () => {
  let service: TrelloActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrelloActionService,
        {
          provide: ActionService,
          useValue: mockActionService,
        },
      ],
    }).compile();

    service = module.get<TrelloActionService>(TrelloActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
