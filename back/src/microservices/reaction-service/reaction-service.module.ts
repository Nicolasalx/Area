import { Module } from '@nestjs/common';
import { ReactionController } from './reaction/reaction.controller';
import { ReactionService } from './reaction/reaction.service';
import { GoogleService } from './google/google.service';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { DiscordService } from './discord/discord.service';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService, GoogleService, PrismaService, DiscordService],
})
export class ReactionServiceModule {}
