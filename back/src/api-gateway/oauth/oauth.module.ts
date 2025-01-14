import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from './github/github.service';
import { GoogleService } from './google/google.service';
import { OAuthService } from './oauth/oauth.service';
import { OAuthController } from './oauth/oauth.controller';
import { UserServiceModule } from '@userService/user-service.module';
import { JwtConfigModule } from 'src/shared/jwt/jwt-config.module';
import { DiscordService } from './discord/discord.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

@Module({
  imports: [
    JwtConfigModule,
    UserServiceModule,
    PrismaServiceModule,
    HttpModule,
  ],
  providers: [GithubService, GoogleService, DiscordService, OAuthService],
  controllers: [OAuthController],
  exports: [OAuthService],
})
export class OAuthModule {}
