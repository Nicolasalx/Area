import { OpenweatherActionData } from '@common/interfaces/openweather.interface';

export class OpenweatherUtils {
  static parseOpenweatherAction(data: any): OpenweatherActionData {
    if (!data?.city) {
      throw new Error('Invalid openweather data: missing city');
    }
    return {
      city: data.city,
      threshold: data.threshold,
      condition: data.condition,
    };
  }
}
