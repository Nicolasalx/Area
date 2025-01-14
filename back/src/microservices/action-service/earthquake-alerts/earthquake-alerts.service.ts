import { ActionService } from '@action-service/action/action.service';
import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import axios from 'axios';

@Injectable()
export class EarthquakeAlertsActionService {
  private readonly apiUrl =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
  private lastEarthquakeTime: number | null = null;

  constructor(private readonly actionService: ActionService) {}

  /**
   * Checks for recent earthquake alerts in the last hour.
   * @param action Action details containing criteria for earthquake alerts.
   * @param reaction List of reactions to execute if an earthquake alert is triggered.
   */
  async checkEarthQuakeAlerts(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
    try {
      const response = await axios.get(this.apiUrl);
      const earthquakes = response.data.features;

      if (earthquakes && earthquakes.length > 0) {
        for (const earthquake of earthquakes) {
          const magnitude = earthquake.properties.mag;
          const location = earthquake.properties.place;
          const time = new Date(earthquake.properties.time);
          const timestamp = time.getTime();

          if (this.lastEarthquakeTime === null) {
            this.lastEarthquakeTime = timestamp;
          } else if (timestamp > this.lastEarthquakeTime) {
            console.log(
              `Earthquake detected: Magnitude ${magnitude} at ${location} (Time: ${time.toISOString()})`,
            );

            const ingredients = [
              { field: 'magnitude', value: magnitude.toString() },
              { field: 'location', value: location },
              { field: 'trigger_date', value: getTriggerDate() },
            ];

            await this.actionService.executeReactions(ingredients, reaction);

            this.lastEarthquakeTime = timestamp;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching earthquake data:', error.message);
    }
  }
}
