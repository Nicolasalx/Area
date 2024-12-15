import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { GoogleActionService } from '@action-service/google/google.service';
import { IActionHandler } from './base.handler';

@Injectable()
export class GoogleActionHandler implements IActionHandler {
  constructor(private readonly googleActionService: GoogleActionService) {}

  canHandle(action: string): boolean {
    return [
      'receive_new_email',
      'new_calendar_event',
      'new_task',
      'new_playlist_youtube',
      'new_drive_element',
    ].includes(action);
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    switch (action.name) {
      case 'receive_new_email':
        await this.googleActionService.receiveNewEmail(action, reactions);
        break;
      case 'new_calendar_event':
        await this.googleActionService.newCalendarEvent(action, reactions);
        break;
      case 'new_task':
        await this.googleActionService.newTask(action, reactions);
        break;
      case 'new_playlist_youtube':
        await this.googleActionService.newPlaylistYoutube(action, reactions);
        break;
      case 'new_drive_element':
        await this.googleActionService.newDriveElement(action, reactions);
        break;
    }
  }
}
