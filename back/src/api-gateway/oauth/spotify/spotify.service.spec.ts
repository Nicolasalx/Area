import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SpotifyService } from './spotify.service';

describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyService,
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

    service = module.get<SpotifyService>(SpotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
