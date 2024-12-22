import { Injectable } from '@nestjs/common';
import { ActionService } from '../action/action.service';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';

@Injectable()
export class TodoistActionService {
  private api: TodoistApi;
  private lastCheckTimestamp: number = Date.now();

  constructor(private readonly actionService: ActionService) {
    this.api = new TodoistApi(process.env.TODOIST_TOKEN);
  }

  async checkNewTask(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
    try {
      const tasks = await this.api.getTasks();
      let newTaskDetected = false;

      for (const task of tasks) {
        if (new Date(task.createdAt).getTime() > this.lastCheckTimestamp) {
          newTaskDetected = true;
          const ingredients = [
            { field: 'task_title', value: task.content },
            { field: 'task_description', value: task.description || '' },
            { field: 'task_priority', value: task.priority.toString() },
            { field: 'trigger_date', value: getTriggerDate() },
          ];
          await this.actionService.executeReactions(ingredients, reaction);
        }
      }

      if (newTaskDetected) {
        this.lastCheckTimestamp = Date.now();
      }
    } catch (error) {
      console.error('Error checking new Todoist task:', error);
    }
  }
}
