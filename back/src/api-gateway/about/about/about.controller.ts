import { Controller, Get, Req } from '@nestjs/common';
import { AboutService } from './about.service';
import { Request } from 'express';
import { AboutResponseDto } from 'src/common/dto/about/about.dto';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('about.json')
  getAbout(@Req() req: Request): AboutResponseDto {
    const clientHost =
      req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return this.aboutService.getAbout(clientHost as string);
  }
}
