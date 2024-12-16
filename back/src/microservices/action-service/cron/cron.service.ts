import { Injectable } from '@nestjs/common';
import { ActionService } from '../action/action.service';
import { ActiveReaction } from '@prisma/client';

@Injectable()
export class CronActionService {
  constructor(private readonly actionService: ActionService) {}

  async handleCronAction(reaction: ActiveReaction[]): Promise<void> {
    console.log('Cron triggered');

    await this.actionService.executeReactions(reaction);
  }
}
