import { Test, TestingModule } from '@nestjs/testing';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

describe('ActionController', () => {
  let controller: ActionController;
  let service: ActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionController],
      providers: [ActionService],
      imports: [PrismaServiceModule],
    }).compile();

    controller = module.get<ActionController>(ActionController);
    service = module.get<ActionService>(ActionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
