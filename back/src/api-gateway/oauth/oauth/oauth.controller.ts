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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GithubService } from '../github/github.service';
import { GoogleService } from '../google/google.service';
import { OAuthService } from './oauth.service';
import { ConnectionType } from '@prisma/client';
import { DiscordService } from '../discord/discord.service';

class PreciseServiceToken {
  userId: string;
  serviceId: number;
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
    private readonly oauthService: OAuthService,
    private readonly googleService: GoogleService,
    private readonly githubService: GithubService,
    private readonly discordSercice: DiscordService,
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
                isSet: false,
              },
              {
                id: 2,
                name: 'Github',
                description: 'Github service.',
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
  @Delete('sercice/delete')
  async deleteServiceToken(@Body() body: PreciseServiceToken) {
    try {
      await this.oauthService.deleteServiceToken(body.userId, body.serviceId);
      return { message: 'Service well removed.' };
    } catch (err) {
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
        );
      return response;
    } catch (err) {
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
        );
      return response;
    } catch (err) {
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
          this.discordSercice,
        );
      return response;
    } catch (err) {
      throw err;
    }
  }
}
