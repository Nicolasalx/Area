import { ActionService } from '@action-service/action/action.service';
import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import axios from 'axios';

@Injectable()
export class FuelPriceActionService {
  private apiUrl =
    'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?limit=20';
  private lastPrice: number | null = null;

  constructor(private readonly actionService: ActionService) {}

  async checkFuelPriceIncrease(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
    try {
      const { price, fuelType } = action.data as {
        price: string;
        fuelType: string;
      };

      if (!fuelType) {
        console.log('No fuelType specified');
        return;
      }

      const response = await axios.get(this.apiUrl);
      const results = response.data.results;

      if (results && results.length > 0) {
        const currentPrice = parseFloat(results[0].gazole_prix);

        if (
          currentPrice > Number(price) &&
          this.lastPrice !== null &&
          this.lastPrice < Number(price)
        ) {
          console.log(
            `Fuel price has increased : ${this.lastPrice} -> ${currentPrice}`,
          );

          const ingredients = [
            { field: 'fuel_type', value: fuelType || 'No Fuel Type' },
            {
              field: 'actual_fuel_price',
              value: currentPrice.toString() || 'No price',
            },
            { field: 'trigger_date', value: getTriggerDate() },
          ];

          await this.actionService.executeReactions(ingredients, reaction);
        }

        this.lastPrice = currentPrice;
      } else {
        console.log('Aucune donnée disponible pour le gazole.');
      }
    } catch (error) {
      console.log('Erreur lors de la récupération des données', error.message);
    }
  }

  async checkFuelPriceDecrease(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
    try {
      const { price, fuelType } = action.data as {
        price: string;
        fuelType: string;
      };

      if (!fuelType) {
        console.log('No fuelType specified');
        return;
      }

      const response = await axios.get(this.apiUrl);
      const results = response.data.results;

      if (results && results.length > 0) {
        const currentPrice = parseFloat(results[0].gazole_prix);

        if (
          currentPrice < Number(price) &&
          this.lastPrice !== null &&
          this.lastPrice > Number(price)
        ) {
          console.log(
            `Fuel price has decreased: ${this.lastPrice} -> ${currentPrice}`,
          );

          const ingredients = [
            { field: 'fuel_type', value: fuelType || 'No Fuel Type' },
            {
              field: 'actual_fuel_price',
              value: currentPrice.toString() || 'No price',
            },
            { field: 'trigger_date', value: getTriggerDate() },
          ];

          await this.actionService.executeReactions(ingredients, reaction);
        }

        this.lastPrice = currentPrice;
      } else {
        console.log('Aucune donnée disponible pour le gazole.');
      }
    } catch (error) {
      console.log('Erreur lors de la récupération des données', error.message);
    }
  }
}
