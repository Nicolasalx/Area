import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { WorldTimeActionService } from '@action-service/worldtime/worldtime.service';
import { IActionHandler } from './base.handler';

@Injectable()
export class WorldTimeActionHandler implements IActionHandler {
  constructor(private readonly worldTimeService: WorldTimeActionService) {}

  canHandle(actionName: string): boolean {
    return ['check_daynight', 'check_timezone'].includes(actionName);
  }

  async handle(action: ActiveAction, reactions: ActiveReaction[]) {
    switch (action.name) {
      case 'check_daynight':
        await this.worldTimeService.checkDayNight(action, reactions);
        break;
      case 'check_timezone':
        await this.worldTimeService.checkTimezone(action, reactions);
        break;
    }
  }
}
