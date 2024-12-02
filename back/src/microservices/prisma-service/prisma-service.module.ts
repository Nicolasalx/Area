import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaController } from './prisma/prisma.controller';

@Module({
  providers: [PrismaService],
  controllers: [PrismaController],
  exports: [PrismaService],
})
export class PrismaServiceModule {}
