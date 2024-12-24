import { Test, TestingModule } from '@nestjs/testing';
import { TwilioReactionService } from './twilio.service';

describe('TwilioService', () => {
  let service: TwilioReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwilioReactionService],
    }).compile();

    service = module.get<TwilioReactionService>(TwilioReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
