import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { IActionHandler } from './base.handler';
import { EarthquakeAlertsActionService } from '@action-service/earthquake-alerts/earthquake-alerts.service';

@Injectable()
export class EarthquakeAlertsActionHandler implements IActionHandler {
  constructor(
    private readonly earthquakeService: EarthquakeAlertsActionService,
  ) {}

  canHandle(action: string): boolean {
    return ['check_earthquake_alerts'].includes(action);
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    switch (action.name) {
      case 'check_earthquake_alerts':
        await this.earthquakeService.checkEarthQuakeAlerts(action, reactions);
        break;
    }
  }
}
