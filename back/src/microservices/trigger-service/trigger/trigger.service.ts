import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { WORKFLOW_EVENTS } from '@shared/event/workflow.events';
import { WorkflowEventPayload } from '@common/interfaces/workflow-event.interface';
import { IActionHandler } from '@trigger-service/handler/base.handler';
import { GithubActionHandler } from '@trigger-service/handler/github.handler';
import { GoogleActionHandler } from '@trigger-service/handler/google.handler';
import { SchedulerActionHandler } from '@trigger-service/handler/sheduler.handler';
import { RssActionHandler } from '@trigger-service/handler/rss.handler';
import { SlackActionHandler } from '@trigger-service/handler/slack.handler';
import { TrelloActionHandler } from '@trigger-service/handler/trello.handler';
import { TodoistActionHandler } from '@trigger-service/handler/todoist.handler';
import { OpenweatherActionHandler } from '@trigger-service/handler/openweather.handler';
import { SpotifyActionHandler } from '@trigger-service/handler/spotify.handler';
import { CoinGeckoActionHandler } from '@trigger-service/handler/coingecko.handler';
import { WorldTimeActionHandler } from '@trigger-service/handler/worldtime.handler';
import { NewsActionHandler } from '@trigger-service/handler/news.handler';
import { FuelPriceActionHandler } from '@trigger-service/handler/fuel-price.handler';
import { EarthquakeAlertsActionHandler } from '@trigger-service/handler/earthquake.handler';
import { OpenSkyActionHandler } from '@trigger-service/handler/opensky.handler';

@Injectable()
export class TriggerService implements OnModuleInit {
  private readonly handlers: IActionHandler[];

  constructor(
    private readonly prisma: PrismaService,
    private readonly githubHandler: GithubActionHandler,
    private readonly googleHandler: GoogleActionHandler,
    private readonly schedulerHandler: SchedulerActionHandler,
    private readonly rssHandler: RssActionHandler,
    private readonly slackHandler: SlackActionHandler,
    private readonly trelloHandler: TrelloActionHandler,
    private readonly todoistHandler: TodoistActionHandler,
    private readonly openweatherHandler: OpenweatherActionHandler,
    private readonly spotifyHandler: SpotifyActionHandler,
    private readonly coinGeckoHandler: CoinGeckoActionHandler,
    private readonly worldtimeHandler: WorldTimeActionHandler,
    private readonly newsHandler: NewsActionHandler,
    private readonly fuelPriceHandler: FuelPriceActionHandler,
    private readonly earthquakeAlertsHandler: EarthquakeAlertsActionHandler,
    private readonly openSkyHandler: OpenSkyActionHandler,
  ) {
    this.handlers = [
      githubHandler,
      googleHandler,
      schedulerHandler,
      rssHandler,
      slackHandler,
      trelloHandler,
      todoistHandler,
      openweatherHandler,
      spotifyHandler,
      coinGeckoHandler,
      worldtimeHandler,
      newsHandler,
      fuelPriceHandler,
      earthquakeAlertsHandler,
      openSkyHandler,
    ];
  }

  onModuleInit() {
    setInterval(async () => {
      await this.getWorkflows();
    }, 10000);
  }

  private async getWorkflows() {
    try {
      const workflows = await this.prisma.workflows.findMany({
        include: {
          activeActions: true,
          activeReactions: true,
          Users: true,
        },
      });

      workflows.forEach((workflow) => {
        const action = workflow.activeActions.at(0);
        if (workflow.isActive) {
          this.selectAction(action, workflow.activeReactions);
        }
      });
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  }

  private async selectAction(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ) {
    const actionHandler = this.handlers.find((handler) =>
      handler.canHandle(action.name),
    );
    if (actionHandler) {
      await actionHandler.handle(action, reactions);
    }
  }

  @OnEvent(WORKFLOW_EVENTS.CREATED)
  async handleWorkflowCreated(payload: WorkflowEventPayload) {
    if (!payload?.action) {
      console.error('Invalid workflow event payload:', payload);
      return;
    }

    await this.selectAction(payload.action, payload.reactions);
  }

  @OnEvent(WORKFLOW_EVENTS.UPDATED)
  async handleWorkflowUpdated(payload: WorkflowEventPayload) {
    if (!payload?.action) {
      return;
    }

    if (this.schedulerHandler.canHandle(payload.action.name)) {
      if (!payload.action.isActive) {
        await this.selectAction(payload.action, payload.reactions);
      } else {
        this.schedulerHandler.cleanupJob(payload.action.id);
      }
    }
  }

  @OnEvent(WORKFLOW_EVENTS.DELETED)
  async handleWorkflowDeleted(payload: WorkflowEventPayload) {
    if (!payload?.action) {
      return;
    }

    if (this.schedulerHandler.canHandle(payload.action.name)) {
      this.schedulerHandler.cleanupJob(payload.action.id);
    }
  }
}
