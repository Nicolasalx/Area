import { Injectable } from '@nestjs/common';
import { ActionService } from '../action/action.service';
import { ActiveReaction } from '@prisma/client';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';

@Injectable()
export class CronActionService {
  constructor(private readonly actionService: ActionService) {}

  async handleCronAction(reaction: ActiveReaction[]): Promise<void> {
    console.log('Cron triggered');

    const ingredients = [{ field: 'trigger_date', value: getTriggerDate() }];
    await this.actionService.executeReactionsBis(ingredients, reaction);
  }
}
