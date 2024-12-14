import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { GithubService } from '../../action-service/github/github.service';
import { TimerService } from '../../action-service/timer/timer.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { WORKFLOW_EVENTS } from '../../../shared/event/workflow.events';
import { TimerUtils } from '@common/utils/timer.utils';
import { WorkflowEventPayload } from '@common/interfaces/workflow-event.interface';
import { CronService } from '../../action-service/cron/cron.service';
import { GoogleActionService } from '../../action-service/google/google.service';
import { CronUtils } from '@common/utils/cron.utils';
import { CronJob } from 'cron';
import { RssService } from '../../action-service/rss/rss.service';

@Injectable()
export class TriggerService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly timerService: TimerService,
    private readonly cronService: CronService,
    private readonly googleActionService: GoogleActionService,
    private readonly rssService: RssService,
  ) {}

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

  private async selectAction(action: ActiveAction, reaction: ActiveReaction[]) {
    switch (action.name) {
      case 'check_push_github':
        await this.githubService.handleGithubPush(action, reaction);
        break;
      case 'check_new_branch':
        await this.githubService.handleNewBranch(action, reaction);
        break;
      case 'check_new_pr':
        await this.githubService.handleNewPullRequest(action, reaction);
        break;
      case 'receive_new_email':
        await this.googleActionService.receiveNewEmail(action, reaction);
        break;
      case 'new_calendar_event':
        await this.googleActionService.newCalendarEvent(action, reaction);
        break;
      case 'new_task':
        await this.googleActionService.newTask(action, reaction);
        break;
      case 'new_playlist_youtube':
        await this.googleActionService.newPlaylistYoutube(action, reaction);
        break;
      case 'new_drive_element':
        await this.googleActionService.newDriveElement(action, reaction);
        break;
      case 'rss_feed':
        await this.rssService.handleRssFeed(action, reaction);
        break;
      default:
        return;
    }
  }

  private async registerTimerAction(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ) {
    if (!action.data) {
      console.error('Invalid action data:', action);
      return;
    }

    const actionDate = TimerUtils.parseActionDate(action.data);
    const targetDate = TimerUtils.createTargetDate(actionDate);
    const jobId = `timer_${action.id}`;

    const executeReaction = async () => {
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
      const timeoutRef = setTimeout(executeReaction, timeout);
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
  private async registerCronAction(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ) {
    if (!action.data) {
      console.error('Invalid cron action data:', action);
      return;
    }

    const cronData = CronUtils.parseCronExpression(action.data);
    const jobId = `cron_${action.id}`;

    try {
      const job = new CronJob(
        cronData.patern,
        async () => {
          try {
            await this.cronService.handleCronAction(reactions);
          } catch (error) {
            console.error(`Error executing cron action ${jobId}: ${error}`);
          }
        },
        null,
        true,
      );

      this.schedulerRegistry.addCronJob(jobId, job);
      console.log(
        `Scheduled cron job ${jobId} with pattern ${cronData.patern}`,
      );
    } catch (error) {
      console.error(`Failed to schedule cron job ${jobId}: ${error.message}`);
      if (this.schedulerRegistry.doesExist('cron', jobId)) {
        this.schedulerRegistry.deleteCronJob(jobId);
      }
    }
  }
  @OnEvent(WORKFLOW_EVENTS.CREATED)
  async handleWorkflowCreated(payload: WorkflowEventPayload) {
    if (!payload || !payload.action) {
      console.error('Invalid workflow event payload:', payload);
      return;
    }

    const { action, reactions } = payload;

    switch (action.name) {
      case 'cron_action':
        await this.registerCronAction(action, reactions);
        break;
      case 'timer_action':
        await this.registerTimerAction(action, reactions);
        break;
      default:
        return;
    }
  }
}
