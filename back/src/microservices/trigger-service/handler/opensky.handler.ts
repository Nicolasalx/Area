import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { IActionHandler } from './base.handler';
import { OpenskyActionService } from '@action-service/opensky/opensky.service';

@Injectable()
export class OpenSkyActionHandler implements IActionHandler {
  constructor(private readonly openSkyService: OpenskyActionService) {}

  canHandle(actionName: string): boolean {
    return [
      'check_new_flight_in_france',
      'check_new_flight_in_england',
      'check_new_flight_in_spain',
    ].includes(actionName);
  }

  async handle(action: ActiveAction, reactions: ActiveReaction[]) {
    switch (action.name) {
      case 'check_new_flight_in_france':
        await this.openSkyService.checkNewFlightInFrance(action, reactions);
        break;
      case 'check_new_flight_in_england':
        await this.openSkyService.checkNewFlightInEngland(action, reactions);
        break;
      case 'check_new_flight_in_spain':
        await this.openSkyService.checkNewFlightInSpain(action, reactions);
        break;
    }
  }
}
