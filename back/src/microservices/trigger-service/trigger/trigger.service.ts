import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { PrismaService } from '@prismaService/prisma/prisma.service';
import { GithubService } from 'src/microservices/action-service/github/github.service';

@Injectable()
export class TriggerService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
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
        console.log('------------------------------------');
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
      default:
        return;
    }
  }
}
