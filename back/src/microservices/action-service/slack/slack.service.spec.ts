import { Test, TestingModule } from '@nestjs/testing';
import { SlackActionService } from '@action-service/slack/slack.service';
import { ActionService } from '@action-service/action/action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('SlackActionService', () => {
  let service: SlackActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [SlackActionService, ActionService],
    }).compile();

    service = module.get<SlackActionService>(SlackActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
