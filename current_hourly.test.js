import { getWeatherStation } from '../js/noaa_api';
import { sunRiseSunSetStorageChecks } from '../js/sun_data';
import { vertexAIStorageChecks } from '../js/vertexAI';
import { moonPhaseStorageChecks } from '../js/moon_phase';
import { setWeeklyData } from '../js/weekly_data';
import { openLocationFrame } from '../js/app';
import { displayWeatherData } from '../js/current_hourly';

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
    getWeatherStation.mockReturnValue(mockWeatherData);
    sunRiseSunSetStorageChecks.mockImplementation(jest.fn());
    vertexAIStorageChecks.mockImplementation(jest.fn());
    moonPhaseStorageChecks.mockImplementation(jest.fn());
    setWeeklyData.mockImplementation(jest.fn());
    openLocationFrame.mockImplementation(jest.fn());
  });

  it('should call necessary functions when DOM is loaded and current location is set', async () => {
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    await Promise.resolve();

    expect(getWeatherStation).toHaveBeenCalledWith(false);
    expect(sunRiseSunSetStorageChecks).toHaveBeenCalledWith(false);
    expect(vertexAIStorageChecks).toHaveBeenCalledWith(false);
    expect(moonPhaseStorageChecks).toHaveBeenCalledWith(false, expect.any(Function));
    expect(setWeeklyData).toHaveBeenCalled();
    expect(openLocationFrame).not.toHaveBeenCalled();
    expect(displayWeatherData).toHaveBeenCalled();
  });

  it('should call openLocationFrame if there is no current location', async () => {
    getWeatherStation.mockReturnValue(null);
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    await Promise.resolve();

    expect(openLocationFrame).toHaveBeenCalled();
  });

  it('should update temperature display correctly when unit changes', async () => {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleButton';
    document.body.appendChild(toggleButton);

    const currentTemperatureElement = document.createElement('div');
    currentTemperatureElement.id = 'current-temperature';
    document.body.appendChild(currentTemperatureElement);

    displayWeatherData();

    expect(currentTemperatureElement.innerText).toBe('77°F');

    toggleButton.click();

    expect(currentTemperatureElement.innerText).toBe('25°C');
  });

});