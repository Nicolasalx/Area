import { Test, TestingModule } from '@nestjs/testing';
import { OAuthService } from './oauth.service';
import { UserService } from '@userService/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleService } from '../google/google.service';
import { GithubService } from '../github/github.service';
import { DiscordService } from '../discord/discord.service';
import { PrismaService } from '@prismaService/prisma/prisma.service';

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
        {
          provide: GoogleService,
          useValue: {
            requestOAuthToken: jest.fn(),
            requestUserInfo: jest.fn(),
          },
        },
        {
          provide: GithubService,
          useValue: {
            requestOAuthToken: jest.fn(),
            requestUserInfo: jest.fn(),
          },
        },
        {
          provide: DiscordService,
          useValue: {
            requestOAuthToken: jest.fn(),
            requestUserInfo: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            requestOAuthToken: jest.fn(),
            requestUserInfo: jest.fn(),
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
