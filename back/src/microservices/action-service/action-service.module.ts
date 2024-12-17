import { Module } from '@nestjs/common';
import { ActionService } from './action/action.service';
import { ActionController } from './action/action.controller';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { GithubActionService } from './github/github.service';
import { ReactionService } from '@reaction-service/reaction/reaction.service';
import { GoogleReactionService } from '@reaction-service/google/google.service';
import { DiscordReactionService } from '@reaction-service/discord/discord.service';
import { SharedAuthModule } from '../../shared/auth/auth.module';
import { TimerActionService } from './timer/timer.service';
import { GoogleActionService } from './google/google.service';
import { RssActionService } from './rss/rss.service';
import { SlackActionService } from './slack/slack.service';
import { SlackReactionService } from '@reaction-service/slack/slack.service';

@Module({
  imports: [PrismaServiceModule, SharedAuthModule],
  providers: [
    ActionService,
    GithubActionService,
    ReactionService,
    GoogleReactionService,
    GoogleActionService,
    DiscordReactionService,
    TimerActionService,
    RssActionService,
    SlackActionService,
    SlackReactionService,
  ],
  controllers: [ActionController],
})
export class ActionServiceModule {}
