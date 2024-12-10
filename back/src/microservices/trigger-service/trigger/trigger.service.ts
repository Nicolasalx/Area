import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { GithubService } from '../../action-service/github/github.service';
import { CronService } from '../../action-service/cron/cron.service';

@Injectable()
export class TriggerService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
    private readonly cronService: CronService,
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
      case 'daily_cron_action':
        await this.cronService.handleDailyCronAction(action, reaction);
        break;
      case 'weekly_cron_action':
        await this.cronService.handleWeeklyCronAction(action, reaction);
        break;
      case 'timer_scheduled_action':
        await this.cronService.handleTimerAction(action, reaction);
        break;
      default:
        return;
    }
  }
}
