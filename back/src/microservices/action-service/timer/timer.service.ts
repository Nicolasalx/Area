import { Injectable } from '@nestjs/common';
import { ActionService } from '../action/action.service';
import { ActiveAction, ActiveReaction } from '@prisma/client';

@Injectable()
export class TimerActionService {
  constructor(private readonly actionService: ActionService) {}

  async handleTimerAction(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
    console.log('Timer triggered - executing reactions');
    await this.actionService.executeReactions(reaction);

    try {
      await this.actionService.prisma.activeAction.update({
        where: { id: action.id },
        data: { isActive: false },
      });
    } catch (error) {
      console.error('Failed to deactivate timer action:', error);
    }
  }
}
