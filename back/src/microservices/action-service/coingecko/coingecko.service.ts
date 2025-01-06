import { ActionService } from '@action-service/action/action.service';
import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import axios from 'axios';

@Injectable()
export class CoingeckoActionService {
  private previousPrices: Record<string, number> = {};

  constructor(private readonly actionService: ActionService) {}

  async checkPriceIncrease(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
    const apiKeyCoinGecko = process.env.API_KEY_COIN_GECKO;
    const { price, crypto } = action.data as { price: string; crypto: string };

    if (!crypto) {
      console.log('No cryptocurrency specified');
      return;
    }

    try {
      const options = {
        method: 'GET',
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.toLowerCase()}&vs_currencies=eur`,
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': apiKeyCoinGecko,
        },
      };

      const response = await axios.request(options);
      const currentPrice = response.data[crypto.toLowerCase()]?.eur;

      if (currentPrice) {
        const previousPrice = this.previousPrices[crypto.toLowerCase()] || null;

        const isAboveThreshold = parseFloat(currentPrice) > parseFloat(price);

        const wasBelowThreshold =
          previousPrice !== null && previousPrice < parseFloat(price);

        if (isAboveThreshold && wasBelowThreshold) {
          console.log(
            `The price of ${crypto} has crossed the threshold, increasing from ${previousPrice} € to ${currentPrice} €`,
          );

          const ingredients = [
            { field: 'crypto', value: crypto || 'No Crypto' },
            {
              field: 'given_crypto_price',
              value: price || 'No price',
            },
            {
              field: 'current_crypto_price',
              value: currentPrice || 'No price',
            },
            { field: 'trigger_date', value: getTriggerDate() },
          ];

          await this.actionService.executeReactions(ingredients, reaction);
        }
        this.previousPrices[crypto.toLowerCase()] = currentPrice;
      } else {
        console.log(`Price for ${crypto} not found`);
      }
    } catch (error) {
      console.error('Error fetching price from CoinGecko:', error);
    }
  }

  async checkPriceDecrease(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    const apiKeyCoinGecko = process.env.API_KEY_COIN_GECKO;
    const { price, crypto } = action.data as { price: string; crypto: string };

    if (!crypto) {
      console.log('No cryptocurrency specified');
      return;
    }

    try {
      const options = {
        method: 'GET',
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.toLowerCase()}&vs_currencies=eur`,
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': apiKeyCoinGecko,
        },
      };

      const response = await axios.request(options);
      const currentPrice = response.data[crypto.toLowerCase()]?.eur;

      if (currentPrice) {
        const previousPrice = this.previousPrices[crypto.toLowerCase()] || null;

        const isBelowThreshold = parseFloat(currentPrice) < parseFloat(price);

        const wasAboveThreshold =
          previousPrice !== null && previousPrice > parseFloat(price);

        if (isBelowThreshold && wasAboveThreshold) {
          console.log(
            `The price of ${crypto} has dropped below the threshold, decreasing from ${previousPrice} € to ${currentPrice} €`,
          );

          const ingredients = [
            { field: 'crypto', value: crypto || 'No Crypto' },
            {
              field: 'given_crypto_price',
              value: price || 'No price',
            },
            {
              field: 'current_crypto_price',
              value: currentPrice || 'No price',
            },
            { field: 'trigger_date', value: getTriggerDate() },
          ];

          await this.actionService.executeReactions(ingredients, reactions);
        }

        this.previousPrices[crypto.toLowerCase()] = currentPrice;
      } else {
        console.log(`Price for ${crypto} not found`);
      }
    } catch (error) {
      console.error('Error fetching price from CoinGecko:', error);
    }
  }
}
