import { Module } from '@nestjs/common';
import { AboutService } from './about/about.service';
import { AboutController } from './about/about.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';

@Module({
  imports: [PrismaServiceModule],
  providers: [AboutService],
  controllers: [AboutController],
})
export class AboutModule {}
