import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { GithubService } from '../../action-service/github/github.service';
import { TimerService } from 'src/microservices/action-service/timer/timer.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { WORKFLOW_EVENTS } from 'src/shared/event/workflow.events';
import { TimerUtils } from '@common/utils/timer.utils';
import { WorkflowEventPayload } from '@common/interfaces/workflow-event.interface';

@Injectable()
export class TriggerService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly timerService: TimerService
  ) { }

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
        this.selectAction(action, workflow.activeReactions);
      });
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  }

  private async selectAction(action: ActiveAction, reaction: ActiveReaction[]) {
    switch (action.name) {
      case 'check_push_github':
        await this.githubService.handleGithubPush(action, reaction);
        break;
      // case 'daily_cron_action':
      //   await this.cronService.handleDailyCronAction(action, reaction);
      //   break;
      // case 'weekly_cron_action':
      //   await this.cronService.handleWeeklyCronAction(action, reaction);
      //   break;
      // case 'timer_scheduled_action':
      //   await this.timerService.handleTimerAction(action, reaction);
      //   break;
      default:
        return;
    }
  }

  @OnEvent(WORKFLOW_EVENTS.CREATED)
  async handleWorkflowCreated(payload: WorkflowEventPayload) {
    if (!payload || !payload.action) {
      console.error('Invalid workflow event payload:', payload);
      return;
    }

    const { action, reactions } = payload;

    if (action.name === 'timer_scheduled_action') {
      await this.scheduleTimer(action, reactions);
    }
  }

  private async scheduleTimer(action: ActiveAction, reactions: ActiveReaction[]) {
    if (!action.data) {
      console.error('Invalid action data:', action);
      return;
    }

    const actionDate = TimerUtils.parseActionDate(action.data);
    const targetDate = TimerUtils.createTargetDate(actionDate);
    const jobId = `timer_${action.id}`;

    const executeAction = async () => {
      try {
        await this.timerService.handleTimerAction(action, reactions);
      } finally {
        try {
          if (this.schedulerRegistry.doesExist('timeout', jobId)) {
            this.schedulerRegistry.deleteTimeout(jobId);
          }
        } catch (error) {
          console.warn(`Failed to delete timeout ${jobId}: ${error.message}`);
        }
      }
    };

    const timeout = targetDate.getTime() - new Date().getTime();
    if (timeout > 0) {
      const timeoutRef = setTimeout(executeAction, timeout);
      try {
        this.schedulerRegistry.addTimeout(jobId, timeoutRef);
        console.log(`Scheduled timer ${jobId} for ${targetDate}`);
      } catch (error) {
        clearTimeout(timeoutRef);
        console.error(`Failed to schedule timer ${jobId}: ${error.message}`);
      }
    } else {
      console.error(`Invalid date ${jobId}: target date is in the past`);
    }
  }
}
