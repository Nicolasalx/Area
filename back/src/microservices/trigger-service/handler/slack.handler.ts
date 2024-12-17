import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { SlackActionService } from '@action-service/slack/slack.service';
import { IActionHandler } from './base.handler';

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
    switch (action.name) {
      case 'check_new_message':
        await this.slackService.checkNewMessage(action, reactions);
        break;
      case 'check_mention':
        await this.slackService.checkMentions(action, reactions);
        break;
      case 'check_reaction':
        await this.slackService.checkReaction(action, reactions);
        break;
      case 'check_file_shared':
        await this.slackService.checkFileShared(action, reactions);
        break;
    }
  }
}
