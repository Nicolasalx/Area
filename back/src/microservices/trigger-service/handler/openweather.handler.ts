import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { OpenweatherActionService } from '@action-service/openweather/openweather.service';
import { IActionHandler } from './base.handler';

@Injectable()
export class OpenweatherActionHandler implements IActionHandler {
  constructor(private readonly weatherService: OpenweatherActionService) {}

  canHandle(actionName: string): boolean {
    return ['check_temperature', 'check_weather_change'].includes(actionName);
  }

  async handle(action: ActiveAction, reactions: ActiveReaction[]) {
    switch (action.name) {
      case 'check_temperature':
        await this.weatherService.checkTemperature(action, reactions);
        break;
      case 'check_weather_change':
        await this.weatherService.checkWeatherChange(action, reactions);
        break;
    }
  }
}
