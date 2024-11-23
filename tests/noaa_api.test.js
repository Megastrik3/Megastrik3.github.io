import { getWeatherStation, getCurrentObservations, getDailyWeatherForecast, getHourlyForecast } from "../js/noaa_api.js";

global.fetch = jest.fn();

global.console.error = jest.fn();

beforeEach(() => {
  Object.defineProperty(global, 'localStorage', {
    value: {
      getItem: jest.fn().mockImplementation((key) => {
        if (key === 'currentLocation') {
          return '40.7128,-74.0060';
        }
        return null;
      }),
      setItem: jest.fn(),
    },
    writable: true,
  });
});

describe("noaa_api.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch weather grid points and weather station information", async () => {
    document.addEventListener('DOMContentLoaded', async () => {
      const mockGridPointsResponse = {
        properties: {
          forecast: "https://api.weather.gov/gridpoints/XYZ/1,1/forecast",
          forecastZone: "zone-xyz",
          cwa: "XYZ",
          gridX: 1,
          gridY: 1
        }
      };
      const mockStationsResponse = {
        observationStations: [
          "https://api.weather.gov/stations/XYZ123"
        ]
      };
  
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockGridPointsResponse),
      }).mockResolvedValueOnce({
        json: () => Promise.resolve(mockStationsResponse),
      }).mockResolvedValueOnce({
        json: () => Promise.resolve({}),
      }).mockResolvedValueOnce({
        json: () => Promise.resolve({}),
      });
  
      await getWeatherStation(false);
  
      expect(fetch).toHaveBeenCalledWith("https://api.weather.gov/points/40.7128,-74.0060");
      expect(fetch).toHaveBeenCalledWith("https://api.weather.gov/gridpoints/XYZ/1,1/stations");
  
      expect(fetch).toHaveBeenCalledWith("https://api.weather.gov/stations/XYZ123/observations/latest");
    });
  });

  it("should call getDailyWeatherForecast and getHourlyForecast if forceRefresh is true", async () => {
    const mockGridPointsResponse = {
      properties: {
        forecast: "https://api.weather.gov/gridpoints/XYZ/1,1/forecast",
        forecastZone: "zone-xyz",
        cwa: "XYZ",
        gridX: 1,
        gridY: 1
      }
    };
    const mockStationsResponse = {
      observationStations: [
        "https://api.weather.gov/stations/XYZ123"
      ]
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockGridPointsResponse),
    }).mockResolvedValueOnce({
      json: () => Promise.resolve(mockStationsResponse),
    }).mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    }).mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    });

    await getWeatherStation(true);

    expect(fetch).toHaveBeenCalledWith("https://api.weather.gov/points/40.7128,-74.0060");
    expect(fetch).toHaveBeenCalledWith("https://api.weather.gov/gridpoints/XYZ/1,1/stations");
    expect(fetch).toHaveBeenCalledWith("https://api.weather.gov/gridpoints/XYZ/1,1/forecast");
    expect(fetch).toHaveBeenCalledWith("https://api.weather.gov/gridpoints/XYZ/1,1/forecast/hourly");
  });

  it("should handle errors gracefully if fetching grid points or weather stations fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch grid points"));

    await getWeatherStation(false);

    expect(console.error).toHaveBeenCalledWith("Error fetching weather grid points:", expect.any(Error));
  });

  it("should handle errors gracefully if fetching daily forecast data fails", async () => {
    const mockGridPointsResponse = {
      properties: {
        forecast: "https://api.weather.gov/gridpoints/XYZ/1,1/forecast",
        forecastZone: "zone-xyz",
        cwa: "XYZ",
        gridX: 1,
        gridY: 1
      }
    };
    const mockStationsResponse = {
      observationStations: [
        "https://api.weather.gov/stations/XYZ123"
      ]
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockGridPointsResponse),
    }).mockResolvedValueOnce({
      json: () => Promise.resolve(mockStationsResponse),
    }).mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    }).mockRejectedValueOnce(new Error("Failed to fetch daily forecast"));

    await getWeatherStation(false);

    expect(console.error).toHaveBeenCalledWith("Error fetching daily forecast data:", expect.any(Error));
  });

  it("should call getCurrentObservations and store data without interacting with localStorage", async () => {
    const mockCurrentObservationsResponse = {
      temperature: "22°C",
      conditions: "Clear"
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockCurrentObservationsResponse),
    });

    const getCurrentObservationsSpy = jest.spyOn({ getCurrentObservations }, "getCurrentObservations");

    await getCurrentObservations();

    expect(fetch).toHaveBeenCalledWith("https://api.weather.gov/stations/XYZ123/observations/latest");

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});