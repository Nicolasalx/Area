import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from './github/github.service';
import { GoogleService } from './google/google.service';
import { OAuthService } from './oauth/oauth.service';
import { OAuthController } from './oauth/oauth.controller';
import { UserServiceModule } from '@userService/user-service.module';
import { JwtConfigModule } from 'src/shared/jwt/jwt-config.module';

@Module({
  imports: [
    JwtConfigModule,
    UserServiceModule,
    HttpModule,
  ],
  providers: [GithubService, GoogleService, OAuthService],
  controllers: [OAuthController],
})
export class OAuthModule { }
