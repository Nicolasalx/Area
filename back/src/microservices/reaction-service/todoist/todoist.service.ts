import { Injectable } from '@nestjs/common';
import { IReactionHandler } from '@reaction-service/handler/base.handler';
import { TodoistApi } from '@doist/todoist-api-typescript';

@Injectable()
export class TodoistReactionService implements IReactionHandler {
  private api: TodoistApi;

  constructor() {
    this.api = new TodoistApi(process.env.TODOIST_TOKEN);
  }

  canHandle(service: string): boolean {
    return service === 'todoist';
  }

  async handle(reaction: string, data: any): Promise<string> {
    switch (reaction) {
      case 'create_task':
        return await this.createTask(data);
      case 'create_project':
        return await this.createProject(data);
      default:
        return 'Unknown reaction type';
    }
  }

  private async createTask(data: {
    content: string;
    description?: string;
    projectId?: string;
    priority?: number;
    dueDate?: string;
  }): Promise<string> {
    try {
      const task = await this.api.addTask({
        content: data.content,
        description: data.description,
        projectId: data.projectId,
        priority: data.priority,
        dueDate: data.dueDate,
      });

      return `Task created successfully with ID: ${task.id}`;
    } catch (error) {
      console.error('Error creating Todoist task:', error);
      return 'Error creating task';
    }
  }

  private async createProject(data: {
    name: string;
    color?: string;
  }): Promise<string> {
    try {
      const project = await this.api.addProject({
        name: data.name,
        color: data.color,
      });

      return `Project created successfully with ID: ${project.id}`;
    } catch (error) {
      console.error('Error creating Todoist project:', error);
      return 'Error creating project';
    }
  }
}
