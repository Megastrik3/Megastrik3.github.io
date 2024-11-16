let currentUnit = 'F'; // Default is Fahrenheit
let temperatureFahrenheit = 72; // Default temperature in Fahrenheit

function toggleTemperature() {
    const tempDisplay = document.getElementById('temperatureDisplay');

    if (currentUnit === 'F') {
        // Convert Fahrenheit to Celsius
        let temperatureCelsius = (temperatureFahrenheit - 32) * 5 / 9;
        tempDisplay.textContent = `${temperatureCelsius.toFixed(2)}°C`;
        currentUnit = 'C'; // Update to Celsius
    } else {
        // Convert Celsius back to Fahrenheit
        tempDisplay.textContent = `${temperatureFahrenheit}°F`;
        currentUnit = 'F'; // Update back to Fahrenheit
    }
}
