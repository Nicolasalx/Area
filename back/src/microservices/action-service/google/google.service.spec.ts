import { Test, TestingModule } from '@nestjs/testing';
import { GoogleActionService } from './google.service';

describe('GoogleActionService', () => {
  let service: GoogleActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleActionService],
    }).compile();

    service = module.get<GoogleActionService>(GoogleActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
