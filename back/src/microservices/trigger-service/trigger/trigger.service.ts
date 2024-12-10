import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { GithubService } from '../../action-service/github/github.service';
import { CronService } from '../../action-service/cron/cron.service';
import { GoogleActionService } from '../../action-service/google/google.service';

@Injectable()
export class TriggerService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
    private readonly cronService: CronService,
    private readonly googleActionService: GoogleActionService,
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
      case 'daily_cron_action':
        await this.cronService.handleDailyCronAction(action);
        break;
      case 'weekly_cron_action':
        await this.cronService.handleWeeklyCronAction(action);
        break;
      case 'timer_scheduled_action':
        await this.cronService.handleTimerAction(action);
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
      default:
        return;
    }
  }
}
