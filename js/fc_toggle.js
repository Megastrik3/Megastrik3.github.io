    let currentUnit = 'F'; // Default is Fahrenheit
    let temperatureFahrenheit = 68; // Default temperature in Fahrenheit

    // Function to toggle between Fahrenheit and Celsius
    function toggleTemperature() {
        const tempDisplay = document.getElementById('temperature');
        const toggleButton = document.getElementById('toggleButton');

        if (currentUnit === 'F') {
            // Convert Fahrenheit to Celsius
            let temperatureCelsius = (temperatureFahrenheit - 32) * 5 / 9;
            tempDisplay.textContent = `${temperatureCelsius.toFixed(2)}°C`; // Display Celsius
            toggleButton.textContent = 'Switch to Fahrenheit'; // Change button text
            currentUnit = 'C'; // Update to Celsius
        } else {
            // Convert Celsius back to Fahrenheit
            tempDisplay.textContent = `${temperatureFahrenheit}°F`; // Display Fahrenheit
            toggleButton.textContent = 'Switch to Celsius'; // Change button text
            currentUnit = 'F'; // Update to Fahrenheit
        }
    }

    document.getElementById('toggleButton').addEventListener('click', toggleTemperature);
