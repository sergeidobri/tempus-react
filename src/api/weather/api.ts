// import { WEATHER_ENDPOINTS } from "./endpoints";
// import type {
//   CityObject,
//   GetGeocodeByPromptRequest,
//   GetGeocodeByPromptResponse,
// } from "./types";

// export const weatherApi = {
//   getGeocode: async (
//     data: GetGeocodeByPromptRequest
//   ): Promise<GetGeocodeByPromptResponse> => {
//     if (data.prompt && data.prompt.length > 0) {
//       const response = await fetch(
//         `${WEATHER_ENDPOINTS.GEOCODE}?name=${encodeURIComponent(data.prompt)}&count=5&language=ru&format=json`
//       );
//       if (response.ok) {
//         console.log(response.status);
//         const resultData = await response.json();
//         const citiesArray: CityObject[] = resultData.results;
//         return {
//           cities: citiesArray.map((item) => ({
//             name: item.name,
//             country: item.country,
//             latitude: item.latitude,
//             longitude: item.longitude,
//           })),
//         };
//       }
//     }
//     console.error(`Возникла ошибка при получении погоды.`);
//     return { cities: [] };
//   },
// };

import { WEATHER_ENDPOINTS } from "./endpoints";
import type {
  CityObject,
  GetGeocodeByPromptRequest,
  GetGeocodeByPromptResponse,
  OpenMeteoForecastResponse,
} from "./types";

export const weatherApi = {
  getGeocode: async (
    data: GetGeocodeByPromptRequest
  ): Promise<CityObject[]> => {
    const { prompt } = data;

    if (!prompt?.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        `${WEATHER_ENDPOINTS.GEOCODE}?name=${encodeURIComponent(prompt.trim())}&count=5&language=ru&format=json`
      );

      if (!response.ok) {
        console.error(
          `Geocoding API error: ${response.status} ${response.statusText}`
        );
        return [];
      }

      const resultData: GetGeocodeByPromptResponse = await response.json();

      if (!Array.isArray(resultData.results)) {
        console.warn("Unexpected geocoding response format:", resultData);
        return [];
      }

      const cities: CityObject[] = resultData.results
        .map((item) => ({
          name: String(item.name ?? ""),
          country: String(item.country ?? ""),
          latitude: typeof item.latitude === "number" ? item.latitude : 0,
          longitude: typeof item.longitude === "number" ? item.longitude : 0,
        }))
        .filter(
          (city) =>
            city.name.trim() !== "" &&
            !isNaN(city.latitude) &&
            !isNaN(city.longitude)
        );

      return cities;
    } catch (error) {
      console.error("Failed to fetch geocoding data:", error);
      return [];
    }
  },
  getForecast: async (
    lat: number,
    lon: number
  ): Promise<OpenMeteoForecastResponse> => {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: "temperature_2m",
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather forecast");
    }

    return response.json();
  },
};
