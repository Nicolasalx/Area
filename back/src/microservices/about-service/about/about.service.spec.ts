import { Test, TestingModule } from '@nestjs/testing';
import { AboutService } from './about.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('AboutService', () => {
  let service: AboutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [AboutService],
    }).compile();

    service = module.get<AboutService>(AboutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
