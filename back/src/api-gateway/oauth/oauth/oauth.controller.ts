import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GithubService } from '../github/github.service';
import { GoogleService } from '../google/google.service';
import { OAuthService } from './oauth.service';
import { ConnectionType } from '@prisma/client';
import { DiscordService } from '../discord/discord.service';

class PreciseServiceToken {
  userId: string;
  serviceId: number;
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
  @Get(':id')
  async getServiceOauthActive(@Param('id') id: string) {
    return await this.oauthService.getServiceOAuthList(id);
  }

  @ApiOperation({
    summary: 'Delete Service Token User in Service',
  })
  @ApiBody({
    type: PreciseServiceToken,
    description: 'User credentials',
    examples: {
      example1: {
        value: {
          userId: '12345678987654',
          serviceId: '1',
        },
      },
    },
  })
  @Delete('sercice/delete')
  async deleteServiceToken(@Body() body: PreciseServiceToken) {
    return await this.oauthService.deleteServiceToken(
      body.userId,
      body.serviceId,
    );
  }

  @ApiOperation({
    summary: 'Login user with Google',
    description: 'Authenticate user with Google OAuth',
  })
  @Get('google/callback')
  async getGoogleOAuth(@Query() query: any) {
    this.logger.debug('OAuth with google');
    return await this.oauthService.getServiceOAuth(
      query.code,
      query.redirect_uri,
      ConnectionType.GOOGLE,
      this.googleService,
    );
  }

  @ApiOperation({
    summary: 'Login user with Github',
    description: 'Authenticate user with Github OAuth',
  })
  @Get('github/callback')
  async getGithubOAuth(@Query() query: any) {
    this.logger.debug('OAuth with github');
    return await this.oauthService.getServiceOAuth(
      query.code,
      '',
      ConnectionType.GITHUB,
      this.githubService,
    );
  }

  @ApiOperation({
    summary: 'Login user with Discord',
    description: 'Authenticate user with Discord OAuth',
  })
  @Get('discord/callback')
  async getDiscordOAuth(@Query() query: any) {
    this.logger.debug('OAuth with discord');
    return await this.oauthService.getServiceOAuth(
      query.code,
      '',
      ConnectionType.DISCORD,
      this.discordSercice,
    );
  }
}
