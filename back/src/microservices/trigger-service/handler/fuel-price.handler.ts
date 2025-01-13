import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { IActionHandler } from './base.handler';
import { FuelPriceActionService } from '@action-service/fuel-price/fuel-price.service';

@Injectable()
export class FuelPriceActionHandler implements IActionHandler {
  constructor(private readonly fuelPriceService: FuelPriceActionService) {}

  canHandle(action: string): boolean {
    return ['check_fuel_price_increase', 'check_fuel_price_decrease'].includes(
      action,
    );
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    switch (action.name) {
      case 'check_fuel_price_increase':
        await this.fuelPriceService.checkFuelPriceIncrease(action, reactions);
        break;
      case 'check_fuel_price_decrease':
        await this.fuelPriceService.checkFuelPriceDecrease(action, reactions);
        break;
    }
  }
}
