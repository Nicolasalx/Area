import { Test, TestingModule } from '@nestjs/testing';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('AboutController', () => {
  let controller: AboutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      controllers: [AboutController],
      providers: [AboutService],
    }).compile();

    controller = module.get<AboutController>(AboutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
