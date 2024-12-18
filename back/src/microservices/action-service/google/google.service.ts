import { Injectable } from '@nestjs/common';
import { ActionService } from '../action/action.service';
import { receiveNewEmail } from './receive-new-mail';
import { newCalendarEvent } from './new-calendar-event';
import { newTask } from './new-task';
import { newPlaylistYoutube } from './new-playlist-youtube';
import { newDriveElement } from './new-drive-element';

@Injectable()
export class GoogleActionService {
  private lastCheckTimestamp: number = Date.now();

  constructor(private readonly actionService: ActionService) {}

  async receiveNewEmail(action: any, reaction: any[]): Promise<void> {
    action.lastCheckTimestamp = this.lastCheckTimestamp;
    await receiveNewEmail(action, reaction, this.actionService);
    this.lastCheckTimestamp = action.lastCheckTimestamp;
  }

  async newCalendarEvent(action: any, reaction: any[]): Promise<void> {
    action.lastCheckTimestamp = this.lastCheckTimestamp;
    await newCalendarEvent(action, reaction, this.actionService);
    this.lastCheckTimestamp = action.lastCheckTimestamp;
  }

  async newTask(action: any, reaction: any[]): Promise<void> {
    action.lastCheckTimestamp = this.lastCheckTimestamp;
    await newTask(action, reaction, this.actionService);
    this.lastCheckTimestamp = action.lastCheckTimestamp;
  }

  async newPlaylistYoutube(action: any, reaction: any[]): Promise<void> {
    action.lastCheckTimestamp = this.lastCheckTimestamp;
    await newPlaylistYoutube(action, reaction, this.actionService);
    this.lastCheckTimestamp = action.lastCheckTimestamp;
  }

  async newDriveElement(action: any, reaction: any[]): Promise<void> {
    action.lastCheckTimestamp = this.lastCheckTimestamp;
    await newDriveElement(action, reaction, this.actionService);
    this.lastCheckTimestamp = action.lastCheckTimestamp;
  }
}
