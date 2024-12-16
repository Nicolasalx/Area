import { Module } from '@nestjs/common';
import { ReactionController } from './reaction/reaction.controller';
import { ReactionService } from './reaction/reaction.service';
import { GoogleReactionService } from './google/google.service';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { DiscordReactionService } from './discord/discord.service';
import { SharedAuthModule } from '../../shared/auth/auth.module';

@Module({
  imports: [SharedAuthModule],
  controllers: [ReactionController],
  providers: [
    ReactionService,
    GoogleReactionService,
    PrismaService,
    DiscordReactionService,
  ],
})
export class ReactionServiceModule {}
