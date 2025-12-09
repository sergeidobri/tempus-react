import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocationState = {
  city: string | null;
  country: string | null;
  lat: number | null;
  lon: number | null;
  setLocation: (
    city: string,
    country: string,
    lat: number,
    lon: number
  ) => void;
};

const DEFAULT_LOCATION = {
  city: "Москва",
  country: "Россия",
  lat: 55.75222,
  lon: 37.61556,
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      ...DEFAULT_LOCATION,
      setLocation: (city, country, lat, lon) =>
        set({ city, country, lat, lon }),
    }),
    {
      name: "user-location", // ключ в localStorage
    }
  )
);
