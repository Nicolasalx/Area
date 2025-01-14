import { ActionService } from '@action-service/action/action.service';
import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import axios from 'axios';

@Injectable()
export class OpenskyActionService {
  private zones = {
    france: {
      westlimit: -5.69,
      southlimit: 42.48,
      eastlimit: 10.49,
      northlimit: 51.07,
    },
    england: {
      westlimit: -7.55,
      southlimit: 52.31,
      eastlimit: 3.02,
      northlimit: 59.79,
    },
    spain: {
      westlimit: -11.0,
      southlimit: 36.18,
      eastlimit: 2.49,
      northlimit: 42.17,
    },
  };

  private currentFlights = {
    france: [],
    england: [],
    spain: [],
  };

  private firstCheckDone = {
    france: false,
    england: false,
    spain: false,
  };

  constructor(private readonly actionService: ActionService) {}

  private isInZone(
    lat: number,
    lon: number,
    zone: {
      westlimit: number;
      southlimit: number;
      eastlimit: number;
      northlimit: number;
    },
  ): boolean {
    return (
      lat >= zone.southlimit &&
      lat <= zone.northlimit &&
      lon >= zone.westlimit &&
      lon <= zone.eastlimit
    );
  }

  private async checkNewFlightInZone(
    action: ActiveAction,
    reactions: ActiveReaction[],
    zoneKey: 'france' | 'england' | 'spain',
  ): Promise<void> {
    const zone = this.zones[zoneKey];
    try {
      const response = await axios.get(
        `https://opensky-network.org/api/states/all?lamin=${zone.southlimit}&lomin=${zone.westlimit}&lamax=${zone.northlimit}&lomax=${zone.eastlimit}`,
      );

      const flightsInZone = response.data.states.filter((flight) => {
        return (
          flight[5] !== null &&
          flight[6] !== null &&
          this.isInZone(flight[6], flight[5], zone)
        );
      });

      const currentFlightIds = new Set(
        this.currentFlights[zoneKey].map((flight) => flight[0]),
      );
      for (const flight of flightsInZone) {
        if (!currentFlightIds.has(flight[0])) {
          this.currentFlights[zoneKey].push(flight);

          if (this.firstCheckDone[zoneKey] && flight[1].length > 0) {
            console.log(
              `New flight detected in ${zoneKey} : ${flight[1]} (ID: ${flight[0]})`,
            );

            const ingredients = [
              { field: 'flight_name', value: flight[1] },
              { field: 'flight_id', value: flight[0] },
              { field: 'flight_country', value: zoneKey },
              { field: 'trigger_date', value: getTriggerDate() },
            ];

            this.actionService.executeReactions(ingredients, reactions);
            break;
          }
        }
      }

      this.currentFlights[zoneKey] = this.currentFlights[zoneKey].filter(
        (flight) => {
          return flightsInZone.some((newFlight) => newFlight[0] === flight[0]);
        },
      );

      if (!this.firstCheckDone[zoneKey]) {
        this.firstCheckDone[zoneKey] = true;
      }
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des données pour ${zoneKey} :`,
        error.message,
      );
    }
  }

  async checkNewFlightInFrance(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    await this.checkNewFlightInZone(action, reactions, 'france');
  }

  async checkNewFlightInEngland(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    await this.checkNewFlightInZone(action, reactions, 'england');
  }

  async checkNewFlightInSpain(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    await this.checkNewFlightInZone(action, reactions, 'spain');
  }
}
