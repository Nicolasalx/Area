import { Module } from '@nestjs/common';
import { ReactionController } from './reaction/reaction.controller';
import { ReactionService } from './reaction/reaction.service';
import { GoogleService } from './google/google.service';
import { PrismaService } from '@prismaService/prisma/prisma.service';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService, GoogleService, PrismaService],
})
export class ReactionServiceModule {}
