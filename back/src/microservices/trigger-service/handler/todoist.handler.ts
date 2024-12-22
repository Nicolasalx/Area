import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { TodoistActionService } from '@action-service/todoist/todoist.service';
import { IActionHandler } from './base.handler';

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
    switch (action.name) {
      case 'check_new_task':
        await this.todoistService.checkNewTask(action, reactions);
        break;
    }
  }
}
