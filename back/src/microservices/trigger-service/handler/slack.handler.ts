import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { SlackActionService } from '@action-service/slack/slack.service';
import { IActionHandler } from './base.handler';
import { getToken, getUserId } from '@common/utils/token.utils';

@Injectable()
export class SlackActionHandler implements IActionHandler {
  constructor(private readonly slackService: SlackActionService) {}

  canHandle(action: string): boolean {
    return [
      'check_new_message',
      'check_mention',
      'check_reaction',
      'check_file_shared',
    ].includes(action);
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    const { workflowId } = action;
    const refreshToken = await getToken(await getUserId(workflowId), 'slack');
    if (!refreshToken) {
      console.log('Access token not available');
      return;
    }
    switch (action.name) {
      case 'check_new_message':
        await this.slackService.checkNewMessage(
          action,
          reactions,
          refreshToken,
        );
        break;
      case 'check_mention':
        await this.slackService.checkMentions(action, reactions, refreshToken);
        break;
      case 'check_reaction':
        await this.slackService.checkReaction(action, reactions, refreshToken);
        break;
      case 'check_file_shared':
        await this.slackService.checkFileShared(
          action,
          reactions,
          refreshToken,
        );
        break;
    }
  }
}
