import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { GoogleService } from '../google/google.service';
import { GithubService } from '../github/github.service';
import { HttpService } from '@nestjs/axios';
import { UserService } from '@userService/user/user.service';

describe('OAuthController', () => {
  let controller: OAuthController;
  let service: OAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OAuthController],
      providers: [
        OAuthService,
        GoogleService,
        GithubService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-token'),
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              post: jest.fn(),
              request: jest.fn(),
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByServiceId: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OAuthController>(OAuthController);
    service = module.get<OAuthService>(OAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
