/**
 * @jest-environment jsdom
 */

const celciusToFahrenheit = require('../js/current_hourly.js');
test('32 degrees fahrenheit is 0 degrees celcius', () => {
    currentWeather.temperature = 32;
    expect(updateTemperatureDisplay(32)).toBe(0);
});