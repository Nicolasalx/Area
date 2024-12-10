import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtConfigModule } from '../jwt/jwt-config.module';

@Module({
  imports: [JwtConfigModule],
  providers: [JwtAuthGuard],
  exports: [JwtConfigModule, JwtAuthGuard],
})
export class SharedAuthModule {}
