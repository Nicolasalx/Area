import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async getGoogleOAuth(@Query() query : any) {//@Req() req: Request, @Res() res: Response) {
    return this.authService.getGoogleOAuth(query.code);
  }

}
