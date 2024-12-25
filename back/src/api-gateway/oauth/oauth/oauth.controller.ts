import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GithubService } from '../github/github.service';
import { GoogleService } from '../google/google.service';
import { OAuthService } from './oauth.service';
import { ConnectionType } from '@prisma/client';
import { DiscordService } from '../discord/discord.service';

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
    summary: 'Login user with Google',
    description: 'Authenticate user with Google OAuth',
  })
  @Get('google/callback')
  async getGoogleOAuth(@Query() query: any) {
    return await this.oauthService.getServiceOAuth(
      query.code,
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
    return await this.oauthService.getServiceOAuth(
      query.code,
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
    return await this.oauthService.getServiceOAuth(
      query.code,
      ConnectionType.DISCORD,
      this.discordSercice,
    );
  }
}
