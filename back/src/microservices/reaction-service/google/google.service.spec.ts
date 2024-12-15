import { Test, TestingModule } from '@nestjs/testing';
import { GoogleReactionService } from './google.service';

describe('GoogleReactionService', () => {
  let service: GoogleReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleReactionService],
    }).compile();

    service = module.get<GoogleReactionService>(GoogleReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
