import { getWeatherStation } from '../js/noaa_api';
import { sunRiseSunSetStorageChecks } from '../js/sun_data';
import { vertexAIStorageChecks } from '../js/vertexAI';
import { moonPhaseStorageChecks } from '../js/moon_phase';
import { setWeeklyData } from '../js/weekly_data';
import { openLocationFrame } from '../js/app';
import { displayWeatherData } from '../js/current_hourly';
import hourlyForecast from './hourlyForecast.json';
import currentObservations from './currentObservations.json';
import dailyForecast from './dailyForecast.json';

/* Copilot Assisted Test Code */
import fs from 'fs';
import path from 'path';
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
document.documentElement.innerHTML = html.toString();
/* End of Copilot Assisted Test Code */

global.localStorage = {
  state: {
    'access-token': 'superHashedString'
  },
  setItem (key, item) {
    this.state[key] = item
  },
  getItem (key) { 
    return this.state[key]
  }
}
const testData = "2024-11-22" + "|" + JSON.stringify(dailyForecast);
const mockLocationData = "42.78959,-83.6164669,Oakland County,Michigan";
localStorage.setItem('currentLocation', mockLocationData);
localStorage.setItem('hourlyForecast', "2024-11-22-19-43|" + JSON.stringify(hourlyForecast));
localStorage.setItem('currentObservations', JSON.stringify(currentObservations));
localStorage.setItem('dailyForecast',testData);


jest.mock('../js/noaa_api', () => ({
  getWeatherStation: jest.fn(),
}));

jest.mock('../js/sun_data', () => ({
  sunRiseSunSetStorageChecks: jest.fn(),
}));

jest.mock('../js/vertexAI', () => ({
  vertexAIStorageChecks: jest.fn(),
}));

jest.mock('../js/moon_phase', () => ({
  moonPhaseStorageChecks: jest.fn(),
}));

jest.mock('../js/weekly_data', () => ({
  setWeeklyData: jest.fn(),
}));

jest.mock('../js/app', () => ({
  openLocationFrame: jest.fn(),
}));

jest.mock('../js/current_hourly', () => ({
  displayWeatherData: jest.fn(),
}));

describe('current_hourly.js', () => {

  const mockWeatherData = {
    temperature: 25,
    description: 'sunny',
    icon: 'sunny-icon.png',
    location: 'Some,Location,USA,12345',
    detailedForecast: 'Partly cloudy with a chance of rain.',
  };

  const mockHourlyData = Array(24).fill({
    temperature: 20,
    icon: 'cloud-icon.png',
    shortForecast: 'Partly cloudy',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getWeatherStation.mockImplementation(jest.fn());
    sunRiseSunSetStorageChecks.mockImplementation(jest.fn());
    vertexAIStorageChecks.mockImplementation(jest.fn());
    moonPhaseStorageChecks.mockImplementation(jest.fn());
    setWeeklyData.mockImplementation(jest.fn());
    openLocationFrame.mockImplementation(jest.fn());
  });

  it('should call necessary functions when DOM is loaded and current location is set', async () => {
    document.addEventListener('DOMContentLoaded', () => {
      expect(getWeatherStation).toHaveBeenCalledWith(false);
      expect(sunRiseSunSetStorageChecks).toHaveBeenCalledWith(false);
  
      expect(vertexAIStorageChecks).toHaveBeenCalledWith(false);
      expect(moonPhaseStorageChecks).toHaveBeenCalledWith(false, expect.any(Function));
      expect(setWeeklyData).toHaveBeenCalled();
      expect(openLocationFrame).not.toHaveBeenCalled();
      expect(displayWeatherData).toHaveBeenCalled();
    });
  });

  it('should call openLocationFrame if there is no current location', async () => {
    getWeatherStation.mockReturnValue(null);
    document.addEventListener('DOMContentLoaded', () => {
      expect(openLocationFrame).toHaveBeenCalled();
    });
    
  });

  it('should update temperature display correctly when unit changes', async () => {
    document.addEventListener('DOMContentLoaded', () => {
      const temperatureF = document.getElementById('current-temperature');
      expect(temperatureF).toContain("F");
      document.getElementById('toggleButton').click();
      expect(temperatureF).toContain("C");
    });
  });

});