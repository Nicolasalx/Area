import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AboutModule } from './about/about.module';

@Module({
  imports: [AuthModule, AboutModule]
})
export class ApiGatewayModule {}
