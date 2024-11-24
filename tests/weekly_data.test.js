import { setWeeklyData } from "../js/weekly_data.js";

beforeEach(() => {

  Object.defineProperty(global, 'localStorage', {
    value: {
      getItem: jest.fn().mockImplementation((key) => {
        if (key === 'currentUnit') {
          return 'F';
        }
        if (key === 'dailyForecast') {
          return '2024-11-01|{"properties":{"periods":[{"name":"Monday","icon":"icon_monday.png","temperature":70,"shortForecast":"Partly cloudy"},{"name":"Monday Night","icon":"icon_monday_night.png","temperature":55,"shortForecast":"Clear"},{"name":"Tuesday","icon":"icon_tuesday.png","temperature":72,"shortForecast":"Sunny"},{"name":"Tuesday Night","icon":"icon_tuesday_night.png","temperature":56,"shortForecast":"Clear"}]}}';
        }
        return null;
      }),
      setItem: jest.fn(),
    },
    writable: true,
  });

  document.createElement = jest.fn().mockImplementation(() => {
    return {
      className: '',
      id: '',
      innerHTML: '',
      appendChild: jest.fn(),
    };
  });

  global.document.getElementById = jest.fn().mockImplementation((id) => {
    return id === 'weekly-weather-days' ? { innerHTML: '' } : null;
  });

  jest.clearAllMocks();
});

describe("setWeeklyData", () => {
  it("should update the DOM with weekly weather data based on currentUnit", () => {
    document.addEventListener('DOMContentLoaded', async () => {
    setWeeklyData();

    const weatherBox = document.createElement.mock.calls[0][0];
    expect(weatherBox.innerHTML).toContain("Monday");
    expect(weatherBox.innerHTML).toContain("70°F");
    expect(weatherBox.innerHTML).toContain("Partly cloudy");
    expect(weatherBox.innerHTML).toContain("icon_monday.png");
    });
  });

  it("should convert temperatures to Celsius when the currentUnit is 'C'", () => {
    document.addEventListener('DOMContentLoaded', async () => {

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn().mockImplementation((key) => {
          if (key === 'currentUnit') {
            return 'C';
          }
          if (key === 'dailyForecast') {
            return '2024-11-01|{"properties":{"periods":[{"name":"Monday","icon":"icon_monday.png","temperature":70,"shortForecast":"Partly cloudy"},{"name":"Monday Night","icon":"icon_monday_night.png","temperature":55,"shortForecast":"Clear"}]}}';
          }
          return null;
        }),
        setItem: jest.fn(),
      },
      writable: true,
    });

    setWeeklyData();

    const weatherBox = document.createElement.mock.calls[0][0];

    expect(weatherBox.innerHTML).toContain("21°C");

    expect(weatherBox.innerHTML).toContain("13°C");
  });
  });

  it("should apply the correct weather data for each day and night period", () => {
    document.addEventListener('DOMContentLoaded', async () => {

    const forecastData = {
      properties: {
        periods: [
          { name: 'Monday', icon: 'icon_monday.png', temperature: 70, shortForecast: 'Partly cloudy' },
          { name: 'Monday Night', icon: 'icon_monday_night.png', temperature: 55, shortForecast: 'Clear' },
          { name: 'Tuesday', icon: 'icon_tuesday.png', temperature: 72, shortForecast: 'Sunny' },
          { name: 'Tuesday Night', icon: 'icon_tuesday_night.png', temperature: 56, shortForecast: 'Clear' },
        ],
      }
    };

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn().mockImplementation((key) => {
          if (key === 'currentUnit') {
            return 'F';
          }
          if (key === 'dailyForecast') {
            return '2024-11-01|' + JSON.stringify(forecastData);
          }
          return null;
        }),
        setItem: jest.fn(),
      },
      writable: true,
    });

    setWeeklyData();

    const weatherBox = document.createElement.mock.calls[0][0];
    expect(weatherBox.innerHTML).toContain("Monday");
    expect(weatherBox.innerHTML).toContain("Partly cloudy");
    expect(weatherBox.innerHTML).toContain("70°F");

    const nightBox = document.createElement.mock.calls[1][0];
    expect(nightBox.innerHTML).toContain("Monday Night");
    expect(nightBox.innerHTML).toContain("Clear");
    expect(nightBox.innerHTML).toContain("55°F");
  });
  });

  it("should not overwrite the existing content if the same data is added multiple times", () => {
    document.addEventListener('DOMContentLoaded', async () => {
    const forecastData = {
      properties: {
        periods: [
          { name: 'Monday', icon: 'icon_monday.png', temperature: 70, shortForecast: 'Partly cloudy' },
          { name: 'Monday Night', icon: 'icon_monday_night.png', temperature: 55, shortForecast: 'Clear' },
          { name: 'Tuesday', icon: 'icon_tuesday.png', temperature: 72, shortForecast: 'Sunny' },
          { name: 'Tuesday Night', icon: 'icon_tuesday_night.png', temperature: 56, shortForecast: 'Clear' },
        ],
      }
    };

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn().mockImplementation((key) => {
          if (key === 'currentUnit') {
            return 'F';
          }
          if (key === 'dailyForecast') {
            return '2024-11-01|' + JSON.stringify(forecastData);
          }
          return null;
        }),
        setItem: jest.fn(),
      },
      writable: true,
    });

    setWeeklyData();

    const initialHTML = document.getElementById('weekly-weather-days').innerHTML;

    setWeeklyData();

    const updatedHTML = document.getElementById('weekly-weather-days').innerHTML;
    expect(updatedHTML).toBe(initialHTML);
  });
  });
});