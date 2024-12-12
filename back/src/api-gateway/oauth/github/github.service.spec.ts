import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              post: jest.fn().mockResolvedValue(
                {
                  data: {
                    access_token: 'access_token'
                  }
                }
              ),
              request: jest.fn().mockResolvedValue(
                {
                  data: {}
                }
              ),
            }
          },
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
