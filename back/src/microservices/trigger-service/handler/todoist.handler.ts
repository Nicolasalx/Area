import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { TodoistActionService } from '@action-service/todoist/todoist.service';
import { IActionHandler } from './base.handler';
import { getToken, getUserId } from '@common/utils/token.utils';

@Injectable()
export class TodoistActionHandler implements IActionHandler {
  constructor(private readonly todoistService: TodoistActionService) {}

  canHandle(action: string): boolean {
    return ['check_new_task', 'check_completed_task'].includes(action);
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    const { workflowId } = action;
    const refreshToken = await getToken(
      await getUserId(workflowId),
      'todoist',
    );
    if (!refreshToken) {
      console.log('Access token not available');
      return;
    }
    switch (action.name) {
      case 'check_new_task':
        await this.todoistService.checkNewTask(action, reactions, refreshToken);
        break;
    }
  }
}
