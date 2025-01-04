import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { ActionService } from '../action/action.service';
import axios from 'axios';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';

@Injectable()
export class WorldTimeActionService {
  private lastStates = new Map<string, boolean>();
  private lastTimeCheck = new Map<string, string>();

  constructor(private readonly actionService: ActionService) {}

  private async fetchTimezoneData(timezone: string) {
    const response = await axios.get(
      `http://worldtimeapi.org/api/timezone/${timezone}`,
    );
    return response.data;
  }

  private parseTime(timeStr: string): { hour: number; minute: number } {
    const [hour, minute] = timeStr.split(':').map(Number);
    if (
      isNaN(hour) ||
      isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      throw new Error('Invalid time format: ' + timeStr + '.');
    }
    return { hour, minute };
  }

  async checkTimezone(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    try {
      const { timezone, time } = action.data as {
        timezone: string;
        time: string;
      };
      const { hour: targetHour, minute: targetMinute } = this.parseTime(time);

      const data = await this.fetchTimezoneData(timezone);
      const currentDate = new Date(data.datetime);
      const currentHour = currentDate.getHours();
      const currentMinute = currentDate.getMinutes();

      const timeKey = `${timezone}-${targetHour}:${targetMinute}`;
      const lastCheck = this.lastTimeCheck.get(timeKey);
      const currentCheck = `${currentHour}:${currentMinute}`;

      if (
        currentHour === targetHour &&
        currentMinute === targetMinute &&
        lastCheck !== currentCheck
      ) {
        const ingredients = [
          { field: 'current_time', value: data.datetime },
          { field: 'timezone', value: timezone },
          { field: 'trigger_date', value: getTriggerDate() },
          { field: 'day_of_week', value: currentDate.getDay().toString() },
        ];
        await this.actionService.executeReactions(ingredients, reactions);
      }

      this.lastTimeCheck.set(timeKey, currentCheck);
    } catch (error) {
      console.error('Error in checkTimezone:', error);
    }
  }

  async checkDayNight(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    try {
      const { timezone } = action.data as { timezone: string };
      const data = await this.fetchTimezoneData(timezone);
      const currentDate = new Date(data.datetime);
      const hour = currentDate.getHours();

      const isDaytime = hour >= 6 && hour < 18;
      const lastState = this.lastStates.get(timezone);

      if (lastState !== undefined && lastState !== isDaytime) {
        const ingredients = [
          { field: 'current_time', value: data.datetime },
          { field: 'is_daytime', value: isDaytime.toString() },
          { field: 'timezone', value: timezone },
          { field: 'trigger_date', value: getTriggerDate() },
          { field: 'day_of_week', value: currentDate.getDay().toString() },
        ];
        await this.actionService.executeReactions(ingredients, reactions);
      }

      this.lastStates.set(timezone, isDaytime);
    } catch (error) {
      console.error('Error in checkDayNight:', error);
    }
  }
}
