import { Test, TestingModule } from '@nestjs/testing';
import { TriggerService } from './trigger.service';
import { PrismaServiceModule } from '@prismaService/prisma-service.module';
import { SchedulerRegistry } from '@nestjs/schedule';

import { GithubActionService } from '@action-service/github/github.service';
import { ActionService } from '@action-service/action/action.service';
import { TimerActionService } from '@action-service/timer/timer.service';
import { GoogleActionService } from '@action-service/google/google.service';
import { CronActionService } from '@action-service/cron/cron.service';
import { RssActionService } from '@action-service/rss/rss.service';
import { SlackActionService } from '@action-service/slack/slack.service';
import { TodoistActionService } from '@action-service/todoist/todoist.service';

import { GithubActionHandler } from '@trigger-service/handler/github.handler';
import { GoogleActionHandler } from '@trigger-service/handler/google.handler';
import { SchedulerActionHandler } from '@trigger-service/handler/sheduler.handler';
import { RssActionHandler } from '@trigger-service/handler/rss.handler';
import { SlackActionHandler } from '@trigger-service/handler/slack.handler';
import { TrelloActionService } from '@action-service/trello/trello.service';
import { TrelloActionHandler } from '@trigger-service/handler/trello.handler';
import { TodoistActionHandler } from '@trigger-service/handler/todoist.handler';
import { OpenweatherActionHandler } from '@trigger-service/handler/openweather.handler';
import { OpenweatherActionService } from '@action-service/openweather/openweather.service';
import { SpotifyActionHandler } from '@trigger-service/handler/spotify.handler';
import { SpotifyActionService } from '@action-service/spotify/spotify.service';
import { WorldTimeActionService } from '@action-service/worldtime/worldtime.service';
import { WorldTimeActionHandler } from '@trigger-service/handler/worldtime.handler';
import { NewsActionService } from '@action-service/news/news.service';
import { NewsActionHandler } from '@trigger-service/handler/news.handler';
import { CoingeckoActionService } from '@action-service/coingecko/coingecko.service';
import { CoinGeckoActionHandler } from '@trigger-service/handler/coingecko.handler';
import { FuelPriceActionService } from '@action-service/fuel-price/fuel-price.service';
import { FuelPriceActionHandler } from '@trigger-service/handler/fuel-price.handler';
import { EarthquakeAlertsActionService } from '@action-service/earthquake-alerts/earthquake-alerts.service';
import { EarthquakeAlertsActionHandler } from '@trigger-service/handler/earthquake.handler';

describe('TriggerService', () => {
  let service: TriggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaServiceModule],
      providers: [
        TriggerService,
        {
          provide: ActionService,
          useValue: {},
        },
        {
          provide: GithubActionService,
          useValue: {},
        },
        {
          provide: GoogleActionService,
          useValue: {},
        },
        {
          provide: TimerActionService,
          useValue: {},
        },
        {
          provide: CronActionService,
          useValue: {},
        },
        {
          provide: RssActionService,
          useValue: {},
        },
        {
          provide: SlackActionService,
          useValue: {},
        },
        {
          provide: TodoistActionService,
          useValue: {},
        },
        {
          provide: TrelloActionService,
          useValue: {},
        },
        {
          provide: OpenweatherActionService,
          useValue: {},
        },
        {
          provide: SpotifyActionService,
          useValue: {},
        },
        {
          provide: WorldTimeActionService,
          useValue: {},
        },
        {
          provide: NewsActionService,
          useValue: {},
        },
        {
          provide: CoingeckoActionService,
          useValue: {},
        },
        {
          provide: FuelPriceActionService,
          useValue: {},
        },
        {
          provide: EarthquakeAlertsActionService,
          useValue: {},
        },

        GithubActionHandler,
        GoogleActionHandler,
        SchedulerActionHandler,
        RssActionHandler,
        SlackActionHandler,
        TrelloActionHandler,
        TodoistActionHandler,
        OpenweatherActionHandler,
        SpotifyActionHandler,
        WorldTimeActionHandler,
        NewsActionHandler,
        CoinGeckoActionHandler,
        FuelPriceActionHandler,
        EarthquakeAlertsActionHandler,

        {
          provide: SchedulerRegistry,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TriggerService>(TriggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
