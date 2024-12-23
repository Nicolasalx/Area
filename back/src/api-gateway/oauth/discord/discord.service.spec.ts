import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { DiscordService } from './discord.service';

describe('DiscordService', () => {
  let service: DiscordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              post: jest.fn().mockResolvedValue({
                data: {
                  access_token: 'access_token',
                },
              }),
              request: jest.fn().mockResolvedValue({
                data: {},
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DiscordService>(DiscordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
