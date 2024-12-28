export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

export interface OpenweatherActionData {
  city: string;
  threshold?: string;
  condition?: 'above' | 'below';
}
