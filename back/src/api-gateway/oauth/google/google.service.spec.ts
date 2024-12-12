import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { GoogleService } from './google.service';

describe('GoogleService', () => {
  let service: GoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleService,
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

    service = module.get<GoogleService>(GoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
