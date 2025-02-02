import { Test, TestingModule } from '@nestjs/testing';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { JwtModule } from '@nestjs/jwt';
import { GoogleReactionService } from '@reaction-service/google/google.service';

describe('ReactionController', () => {
  let controller: ReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionController],
      providers: [
        {
          provide: ReactionService,
          useValue: {},
        },
        {
          provide: GoogleReactionService,
          useValue: {},
        },
      ],
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
    }).compile();

    controller = module.get<ReactionController>(ReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
