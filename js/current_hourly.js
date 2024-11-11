import { getWeatherStation } from "./noaa_api.js";
import { sunRiseSunSetStorageChecks } from "./sun_data.js";
import { vertexAIStorageChecks } from "./vertexAI.js";
import { moonPhaseStorageChecks } from "./moon_phase.js";
import { setWeeklyData } from "./weekly_data.js";
document.addEventListener("DOMContentLoaded", async function () {
    // if there is not a current location set, force the user to select a location
    if (localStorage.getItem("currentLocation") == null) {
        window.location.href = "LocationSelect.html";
    } else {
        try {
            await getWeatherStation(false);
            await sunRiseSunSetStorageChecks(false);
            await vertexAIStorageChecks(false);
            moonPhaseStorageChecks(false, () => console.log("Moon phase data loaded"));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    let currentUnit = 'F'; // Default unit is Fahrenheit
    if (localStorage.getItem("currentUnit") != null){
        currentUnit = localStorage.getItem("currentUnit");
    }
    // Mock data (replace with API fetch in production)
    const currentWeather = {
        temperature: (JSON.parse(localStorage.getItem("currentObservations")).properties.temperature.value * 9 / 5 + 32).toFixed(0),
        description: JSON.parse(localStorage.getItem("currentObservations")).properties.textDescription,
        icon: JSON.parse(localStorage.getItem("currentObservations")).properties.icon,
        location: localStorage.getItem("currentLocation").split(",")[2] + ", " + localStorage.getItem("currentLocation").split(",")[3],
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        detailedForecast: JSON.parse(localStorage.getItem("dailyForecast").split("|")[1]).properties.periods[0].detailedForecast,
    };
    const noaaHourlyWeather = JSON.parse(localStorage.getItem("hourlyForecast").split("|")[1]);
    const hourlyWeather = [];
    for (let i = 0; i < 24; i++) {
        hourlyWeather.push({
            time: new Date(noaaHourlyWeather.properties.periods[i].startTime).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' }),
            temperature: noaaHourlyWeather.properties.periods[i].temperature,
            icon: noaaHourlyWeather.properties.periods[i].icon,
            shortForecast: noaaHourlyWeather.properties.periods[i].shortForecast
        });
    }

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
            let shortForecast = hour.shortForecast.replace(hour.temperature, temperature);
            weatherBox.innerHTML = `
                <p>${hour.time}</p>
                <h3>${temperature}${unit}</h3>
                <img class=\"hourly-weather-image\" src=\"${hour.icon}\">
                <p>${shortForecast}</p>
            `;
            hourlyForecastContainer.appendChild(weatherBox);
        });
    }
    // Function to toggle between Fahrenheit and Celsius
    function toggleTemperature() {
        currentUnit = currentUnit === 'F' ? 'C' : 'F';
        localStorage.setItem("currentUnit", currentUnit);
        updateTemperatureDisplay();
        setWeeklyData();
    }



    document.getElementById("current-temperature").innerText = `${currentWeather.temperature}°F`;
    document.getElementById("current-description").innerText = currentWeather.description;
    document.getElementById("current-weather-icon").src = currentWeather.icon;
    document.getElementById("location").innerText = `Location: ${currentWeather.location}`;
    document.getElementById("date").innerText = currentWeather.date;
    document.getElementById("detailedForecast").innerText = currentWeather.detailedForecast;
    // Add event listener to the toggle button
    document.getElementById("toggleButton").addEventListener('click', toggleTemperature);

    updateTemperatureDisplay();
});
