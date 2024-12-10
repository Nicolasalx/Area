import { Module } from '@nestjs/common';
import { ActionService } from './action/action.service';
import { ActionController } from './action/action.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { GithubService } from './github/github.service';
import { ReactionService } from '../reaction-service/reaction/reaction.service';
import { GoogleService } from '../reaction-service/google/google.service';
import { DiscordService } from '../reaction-service/discord/discord.service';
import { SharedAuthModule } from '../../shared/auth/auth.module';
import { TimerService } from './timer/timer.service';

@Module({
  imports: [PrismaServiceModule, SharedAuthModule],
  providers: [
    ActionService,
    GithubService,
    ReactionService,
    GoogleService,
    DiscordService,
    TimerService,
  ],
  controllers: [ActionController],
})
export class ActionServiceModule {}
