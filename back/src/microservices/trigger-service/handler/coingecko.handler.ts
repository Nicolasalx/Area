import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { IActionHandler } from './base.handler';
import { CoingeckoActionService } from '@action-service/coingecko/coingecko.service';

@Injectable()
export class CoinGeckoActionHandler implements IActionHandler {
  constructor(private readonly coinGeckoService: CoingeckoActionService) {}

  canHandle(action: string): boolean {
    return ['check_price_increase', 'check_price_decrease'].includes(action);
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    switch (action.name) {
      case 'check_price_increase':
        await this.coinGeckoService.checkPriceIncrease(action, reactions);
        break;
      case 'check_price_decrease':
        await this.coinGeckoService.checkPriceDecrease(action, reactions);
        break;
    }
  }
}
