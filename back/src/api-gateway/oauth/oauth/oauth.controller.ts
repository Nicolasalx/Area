import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Query,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiProperty,
  ApiBody,
} from '@nestjs/swagger';
import { GithubService } from '../github/github.service';
import { GoogleService } from '../google/google.service';
import { OAuthService } from './oauth.service';
import { ConnectionType } from '@prisma/client';
import { DiscordService } from '../discord/discord.service';
import { IsUUID, IsNumber, IsString, MinLength } from 'class-validator';
import { SpotifyService } from '../spotify/spotify.service';
import { PrismaService } from '@prismaService/prisma/prisma.service';

class PreciseServiceToken {
  userId: string;
  serviceId: number;
}

class ApiKeyServiceToken {
  @ApiProperty({
    description: 'The ID of the user to associate the API key with',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4')
  userId: string;

  @ApiProperty({
    description: 'The ID of the service to add the API key for',
    example: 1,
    type: Number,
  })
  @IsNumber()
  serviceId: number;

  @ApiProperty({
    description: 'The API key to store for the service',
    example: 'sk_test_123456789',
    type: String,
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  apiKey: string;
}

class LoginOAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture: string;
  };
}

@ApiTags('Authentication')
@Controller('auth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly oauthService: OAuthService,
    private readonly googleService: GoogleService,
    private readonly githubService: GithubService,
    private readonly discordService: DiscordService,
    private readonly spotifyService: SpotifyService,
  ) {}

  @ApiOperation({
    summary: 'Get service oauth set up with user id',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    content: {
      'application/json': {
        examples: {
          Area: {
            value: [
              {
                id: 1,
                name: 'Google',
                description: 'Google service like Gmail, Calendar, ...',
                oauthNeed: true,
                isSet: false,
              },
              {
                id: 2,
                name: 'Github',
                description: 'Github service.',
                oauthNeed: true,
                isSet: true,
              },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      properties: {
        message: { type: 'string', example: 'User not found' },
      },
    },
  })
  @Get(':id')
  async getServiceOauthActive(@Param('id') id: string) {
    try {
      return await this.oauthService.getServiceOAuthList(id);
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Delete Service Token User in Service',
  })
  @ApiResponse({
    status: 200,
    description: 'User service connexion is well removed',
    schema: {
      properties: {
        message: { type: 'string', example: 'Service well removed.' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid token',
    schema: {
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      properties: {
        message: { type: 'string', example: 'User not found' },
      },
    },
  })
  @Delete('service/delete')
  async deleteServiceToken(@Body() body: PreciseServiceToken) {
    try {
      await this.oauthService.deleteServiceToken(body.userId, body.serviceId);
      return { message: 'Service well removed.' };
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Login user with Google',
    description: 'Authenticate user with Google OAuth',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      properties: {
        token: { type: 'string', example: '12345721' },
        user: {
          type: 'json',
          example: {
            id: '1',
            email: 'someone@gmail.com',
            name: 'someone',
            picture: 'link',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid token',
    schema: {
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @Get('google/callback')
  async getGoogleOAuth(@Query() query: any) {
    try {
      this.logger.debug('OAuth with google');
      const response: LoginOAuthResponse =
        await this.oauthService.getServiceOAuth(
          query.code,
          query.redirect_uri,
          ConnectionType.GOOGLE,
          this.googleService,
          query.state,
        );
      return response;
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Login user with Github',
    description: 'Authenticate user with Github OAuth',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      properties: {
        token: { type: 'string', example: '12345721' },
        user: {
          type: 'json',
          example: {
            id: '1',
            email: 'someone@gmail.com',
            name: 'someone',
            picture: 'link',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid token',
    schema: {
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @Get('github/callback')
  async getGithubOAuth(@Query() query: any) {
    try {
      this.logger.debug('OAuth with github');
      const response: LoginOAuthResponse =
        await this.oauthService.getServiceOAuth(
          query.code,
          query.redirect_uri,
          ConnectionType.GITHUB,
          this.githubService,
          query.state,
        );
      return response;
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Login user with Discord',
    description: 'Authenticate user with Discord OAuth',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      properties: {
        token: { type: 'string', example: '12345721' },
        user: {
          type: 'json',
          example: {
            id: '1',
            email: 'someone@gmail.com',
            name: 'someone',
            picture: 'link',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid token',
    schema: {
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('discord/callback')
  async getDiscordOAuth(@Query() query: any) {
    try {
      this.logger.debug('OAuth with discord');
      const response: LoginOAuthResponse =
        await this.oauthService.getServiceOAuth(
          query.code,
          query.redirect_uri,
          ConnectionType.DISCORD,
          this.discordService,
          query.state,
        );
      return response;
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Login user with Spotify',
    description: 'Authenticate user with Spotify OAuth',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      properties: {
        token: { type: 'string', example: '12345721' },
        user: {
          type: 'json',
          example: {
            id: '1',
            email: 'someone@gmail.com',
            name: 'someone',
            picture: 'link',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid token',
    schema: {
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('spotify/callback')
  async getSpotifyOAuth(@Query() query: any) {
    try {
      this.logger.debug('OAuth with spotify');
      const response: LoginOAuthResponse =
        await this.oauthService.getServiceOAuth(
          query.code,
          query.redirect_uri,
          ConnectionType.SPOTIFY,
          this.spotifyService,
          query.state,
        );
      return response;
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }

  @ApiOperation({
    summary: 'Login user with Trello',
    description: 'Authenticate user with Trello OAuth',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      properties: {
        token: { type: 'string', example: '12345721' },
        user: {
          type: 'json',
          example: {
            id: '1',
            email: 'someone@gmail.com',
            name: 'someone',
            picture: 'link',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid token',
    schema: {
      properties: {
        token: { type: 'string', example: '12345721' },
        state: { type: 'string', example: 'userID' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('trello/callback')
  async getTrelloOAuth(@Query() query: any) {
    try {
      this.logger.debug('OAuth with trello');
      const existingUser = await this.prisma.users.findUnique({
        where: { id: query.state },
      });

      if (existingUser) {
        const serviceId = await this.prisma.services.findFirst({
          where: {
            name: {
              equals: 'trello',
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
          },
        });

        if (serviceId) {
          await this.prisma.serviceTokens.upsert({
            where: {
              userId_serviceId: {
                userId: existingUser.id,
                serviceId: serviceId.id,
              },
            },
            create: {
              userId: existingUser.id,
              serviceId: serviceId.id,
              token: query.token,
            },
            update: {
              token: query.token,
            },
          });
        }
      }
    } catch (err) {
      this.logger.error(`OAuth with trello Failer: ${err.message}`);
    }
  }

  @ApiOperation({
    summary: 'Add API Key for a service',
    description:
      'Store an API key for a service that does not use OAuth authentication',
  })
  @ApiBody({
    type: ApiKeyServiceToken,
    description: 'The API key and associated user/service information',
  })
  @ApiResponse({
    status: 200,
    description: 'API key successfully added',
    schema: {
      properties: {
        message: { type: 'string', example: 'API key successfully added' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
    schema: {
      properties: {
        message: { type: 'string' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              property: { type: 'string', example: 'apiKey' },
              constraints: {
                type: 'object',
                example: {
                  minLength: 'API key must be at least 8 characters long',
                  isString: 'API key must be a string',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid token',
    schema: {
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - service requires OAuth',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'This service requires OAuth authentication',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User or service not found',
    schema: {
      properties: {
        message: { type: 'string', example: 'User or service not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @Post('service/apikey')
  async addServiceApiKey(@Body() body: ApiKeyServiceToken) {
    try {
      await this.oauthService.addServiceApiKey(
        body.userId,
        body.serviceId,
        body.apiKey,
      );
      return { message: 'API key successfully added' };
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }
}
