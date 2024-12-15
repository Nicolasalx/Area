import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { GithubActionService } from '@action-service/github/github.service';
import { IActionHandler } from './base.handler';

@Injectable()
export class GithubActionHandler implements IActionHandler {
  constructor(private readonly githubService: GithubActionService) {}

  canHandle(action: string): boolean {
    return [
      'check_push_github',
      'check_new_branch',
      'check_new_pr',
    ].includes(action);
  }

  async handle(action: ActiveAction, reactions: ActiveReaction[]): Promise<void> {
    switch (action.name) {
      case 'check_push_github':
        await this.githubService.handleGithubPush(action, reactions);
        break;
      case 'check_new_branch':
        await this.githubService.handleNewBranch(action, reactions);
        break;
      case 'check_new_pr':
        await this.githubService.handleNewPullRequest(action, reactions);
        break;
    }
  }
}
