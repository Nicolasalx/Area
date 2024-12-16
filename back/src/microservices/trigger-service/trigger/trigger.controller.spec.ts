import { Test, TestingModule } from '@nestjs/testing';
import { TriggerController } from '@trigger-service/trigger/trigger.controller';

describe('TriggerController', () => {
  let controller: TriggerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TriggerController],
    }).compile();

    controller = module.get<TriggerController>(TriggerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
