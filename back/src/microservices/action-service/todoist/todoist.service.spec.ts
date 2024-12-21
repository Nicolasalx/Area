import { Test, TestingModule } from '@nestjs/testing';
import { TodoistActionService } from './todoist.service';
import { ActionService } from '../action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('TodoistActionService', () => {
  let service: TodoistActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [TodoistActionService, ActionService],
    }).compile();

    service = module.get<TodoistActionService>(TodoistActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
