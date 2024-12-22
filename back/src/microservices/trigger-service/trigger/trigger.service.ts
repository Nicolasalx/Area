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
  ) {
    this.handlers = [
      githubHandler,
      googleHandler,
      schedulerHandler,
      rssHandler,
      slackHandler,
      trelloHandler,
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
}
