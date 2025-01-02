import { ActionService } from '@action-service/action/action.service';
import { WeatherData } from '@common/interfaces/openweather.interface';
import { OpenweatherUtils } from '@common/utils/openweather.utils';
import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import axios from 'axios';

@Injectable()
export class OpenweatherActionService {
  private readonly apiKey = process.env.OPENWEATHER_API_KEY;
  private lastWeatherConditions: Map<string, string> = new Map();

  constructor(private readonly actionService: ActionService) {}

  private async fetchWeatherData(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
      throw error;
    }
  }

  async checkTemperature(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    try {
      const { city, threshold, condition } =
        OpenweatherUtils.parseOpenweatherAction(action.data);
      const weatherData = await this.fetchWeatherData(city);
      const currentTemp = weatherData.main.temp;

      let thresholdMet = false;
      if (condition === 'above') {
        thresholdMet = currentTemp > parseFloat(threshold);
      } else if (condition === 'below') {
        thresholdMet = currentTemp < parseFloat(threshold);
      }

      if (thresholdMet) {
        const ingredients = [
          { field: 'temperature', value: currentTemp.toString() },
          { field: 'city_name', value: weatherData.name },
          { field: 'trigger_date', value: getTriggerDate() },
        ];
        await this.actionService.executeReactions(ingredients, reactions);
      }
    } catch (error) {
      console.error('Error in checkTemperature:', error);
    }
  }

  async checkWeatherChange(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    try {
      const { city } = OpenweatherUtils.parseOpenweatherAction(action.data);
      const weatherData = await this.fetchWeatherData(city);
      const currentCondition = weatherData.weather[0].main;
      const lastCondition = this.lastWeatherConditions.get(city);

      if (lastCondition && lastCondition !== currentCondition) {
        const ingredients = [
          { field: 'weather_condition', value: currentCondition },
          { field: 'city_name', value: weatherData.name },
          { field: 'trigger_date', value: getTriggerDate() },
          { field: 'temperature', value: weatherData.main.temp.toString() },
          { field: 'humidity', value: weatherData.main.humidity.toString() },
          { field: 'wind_speed', value: weatherData.wind.speed.toString() },
        ];
        await this.actionService.executeReactions(ingredients, reactions);
      }

      this.lastWeatherConditions.set(city, currentCondition);
    } catch (error) {
      console.error('Error in checkWeatherChange:', error);
    }
  }
}
