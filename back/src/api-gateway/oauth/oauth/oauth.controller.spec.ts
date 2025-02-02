import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { GoogleService } from '../google/google.service';
import { GithubService } from '../github/github.service';
import { HttpService } from '@nestjs/axios';
import { UserService } from '@userService/user/user.service';
import { DiscordService } from '../discord/discord.service';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { SpotifyService } from '../spotify/spotify.service';

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
        DiscordService,
        SpotifyService,
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
          provide: SpotifyService,
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

    controller = module.get<OAuthController>(OAuthController);
    service = module.get<OAuthService>(OAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
