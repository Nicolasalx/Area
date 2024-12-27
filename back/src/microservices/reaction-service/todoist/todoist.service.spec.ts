import { Test, TestingModule } from '@nestjs/testing';
import { TodoistReactionService } from './todoist.service';

describe('TodoistReactionService', () => {
  let service: TodoistReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoistReactionService],
    }).compile();

    service = module.get<TodoistReactionService>(TodoistReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
