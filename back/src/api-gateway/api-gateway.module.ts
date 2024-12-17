import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { OAuthModule } from './oauth/oauth.module';

@Module({
  imports: [AuthModule, OAuthModule],
})
export class ApiGatewayModule {}
