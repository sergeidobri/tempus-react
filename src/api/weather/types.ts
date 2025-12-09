export interface GetGeocodeByPromptRequest {
  prompt: string;
}

export interface CityObject {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface GetGeocodeByPromptResponse {
  results: CityObject[];
}

export interface OpenMeteoCurrentForecast {
  time: string;
  temperature_2m: number;
}

export interface OpenMeteoForecastResponse {
  current: OpenMeteoCurrentForecast;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  timezone_abbreviation?: string;
}
