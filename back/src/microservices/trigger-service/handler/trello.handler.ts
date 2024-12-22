import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { IActionHandler } from './base.handler';
import { TrelloActionService } from '@action-service/trello/trello.service';

@Injectable()
export class TrelloActionHandler implements IActionHandler {
  constructor(private readonly trelloActionService: TrelloActionService) {}

  canHandle(action: string): boolean {
    return [
      'new_card_created',
      'new_card_deleted',
      'new_card_modified',
      'new_card_moved',
      'new_card_label',
    ].includes(action);
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    switch (action.name) {
      case 'new_card_created':
        await this.trelloActionService.newCardCreated(action, reactions);
        break;
      case 'new_card_deleted':
        await this.trelloActionService.detectDeletedCards(action, reactions);
        break;
      case 'new_card_modified':
        await this.trelloActionService.detectModifiedCards(action, reactions);
        break;
      case 'new_card_moved':
        await this.trelloActionService.detectMovedCards(action, reactions);
        break;
      case 'new_card_label':
        await this.trelloActionService.detectNewLabels(action, reactions);
        break;
    }
  }
}
