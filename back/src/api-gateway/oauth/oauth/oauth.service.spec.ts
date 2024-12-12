import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { OAuthService } from './oauth.service';
import { UserService } from '@userService/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserServiceModule } from '@userService/user-service.module';

describe('OAuthService', () => {
  let service: OAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-token'),
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

    service = module.get<OAuthService>(OAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
