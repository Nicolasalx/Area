import { Module } from '@nestjs/common';
import { AboutService } from './about/about.service';
import { AboutController } from './about/about.controller';

@Module({
  providers: [AboutService],
  controllers: [AboutController]
})
export class AboutModule {}
