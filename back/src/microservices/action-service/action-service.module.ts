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
import { TrelloActionService } from './trello/trello.service';
import { TrelloReactionService } from '@reaction-service/trello/trello.service';
import { TodoistReactionService } from '@reaction-service/todoist/todoist.service';
import { TwilioReactionService } from '@reaction-service/twilio/twilio.service';
import { OpenweatherActionService } from './openweather/openweather.service';
import { SpotifyActionService } from './spotify/spotify.service';
import { SpotifyReactionService } from '@reaction-service/spotify/spotify.service';
import { CoingeckoActionService } from './coingecko/coingecko.service';
import { FuelPriceActionService } from './fuel-price/fuel-price.service';
import { EarthquakeAlertsActionService } from './earthquake-alerts/earthquake-alerts.service';
import { OpenskyActionService } from './opensky/opensky.service';

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
    OpenweatherActionService,
    SlackReactionService,
    TrelloActionService,
    TrelloReactionService,
    TodoistReactionService,
    TwilioReactionService,
    SpotifyActionService,
    SpotifyReactionService,
    CoingeckoActionService,
    FuelPriceActionService,
    EarthquakeAlertsActionService,
    OpenskyActionService,
  ],
  controllers: [ActionController],
})
export class ActionServiceModule {}
