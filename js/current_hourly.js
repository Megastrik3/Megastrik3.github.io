document.addEventListener("DOMContentLoaded", function () {
    let currentUnit = 'F'; // Default unit is Fahrenheit

    // Mock data (replace with API fetch in production)
    const currentWeather = {
        temperature: (JSON.parse(localStorage.getItem("currentObservations")).properties.temperature.value * 9 / 5 + 32).toFixed(0),
        description: JSON.parse(localStorage.getItem("currentObservations")).properties.textDescription,
        icon: JSON.parse(localStorage.getItem("currentObservations")).properties.icon,
        location: localStorage.getItem("currentLocation").split(",")[2] + ", " + localStorage.getItem("currentLocation").split(",")[3],
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    };
    const noaaHourlyWeather = JSON.parse(localStorage.getItem("hourlyForecast"));
    const hourlyWeather = [
        { time: new Date(noaaHourlyWeather.properties.periods[0].startTime).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' }), temperature: noaaHourlyWeather.properties.periods[0].temperature, icon: noaaHourlyWeather.properties.periods[0].icon},
        { time: new Date(noaaHourlyWeather.properties.periods[1].startTime).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' }), temperature: noaaHourlyWeather.properties.periods[1].temperature, icon: noaaHourlyWeather.properties.periods[1].icon},
        { time: new Date(noaaHourlyWeather.properties.periods[2].startTime).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' }), temperature: noaaHourlyWeather.properties.periods[2].temperature, icon: noaaHourlyWeather.properties.periods[2].icon},
        { time: new Date(noaaHourlyWeather.properties.periods[3].startTime).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' }), temperature: noaaHourlyWeather.properties.periods[3].temperature, icon: noaaHourlyWeather.properties.periods[3].icon},
        { time: new Date(noaaHourlyWeather.properties.periods[4].startTime).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' }), temperature: noaaHourlyWeather.properties.periods[4].temperature, icon: noaaHourlyWeather.properties.periods[4].icon},
        { time: new Date(noaaHourlyWeather.properties.periods[5].startTime).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' }), temperature: noaaHourlyWeather.properties.periods[5].temperature, icon: noaaHourlyWeather.properties.periods[5].icon }
    ];

    // Function to update the display
    function updateTemperatureDisplay() {
        const tempDisplay = document.getElementById("current-temperature");
        const toggleButton = document.getElementById("toggleButton");

        if (currentUnit === 'F') {
            tempDisplay.innerText = `${currentWeather.temperature}°F`;
            toggleButton.textContent = 'Switch to Celsius';
        } else {
            const temperatureCelsius = ((currentWeather.temperature - 32) * 5 / 9).toFixed(0);
            tempDisplay.innerText = `${temperatureCelsius}°C`;
            toggleButton.textContent = 'Switch to Fahrenheit';
        }

        // Update the hourly forecast with the current unit
        const hourlyForecastContainer = document.getElementById("hourly-forecast");
        hourlyForecastContainer.innerHTML = ''; // Clear existing hourly forecast
        hourlyWeather.forEach((hour) => {
            const weatherBox = document.createElement("div");
            weatherBox.className = "box";

            const temperature = currentUnit === 'F' ? hour.temperature : ((hour.temperature - 32) * 5 / 9).toFixed(0);
            const unit = currentUnit === 'F' ? '°F' : '°C';

            weatherBox.innerHTML = `
                <p>${hour.time}</p>
                <h3>${temperature}${unit}</h3>
                <img src=\"${hour.icon}\">
            `;
            hourlyForecastContainer.appendChild(weatherBox);
        });
    }

    // Function to toggle between Fahrenheit and Celsius
    function toggleTemperature() {
        currentUnit = currentUnit === 'F' ? 'C' : 'F';
        updateTemperatureDisplay();
    }



    document.getElementById("current-temperature").innerText = `${currentWeather.temperature}°F`;
    document.getElementById("current-description").innerText = currentWeather.description;
    document.getElementById("current-weather-icon").src = currentWeather.icon;
    document.getElementById("location").innerText = `Location: ${currentWeather.location}`;
    document.getElementById("date").innerText = currentWeather.date;

    // Add event listener to the toggle button
    document.getElementById("toggleButton").addEventListener('click', toggleTemperature);

    updateTemperatureDisplay();
});
