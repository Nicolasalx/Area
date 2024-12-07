import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async getGoogleOAuth(@Query() query : any) {
    return this.authService.getGoogleOAuth(query.code);
  }
}
