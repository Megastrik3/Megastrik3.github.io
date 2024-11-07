document.addEventListener("DOMContentLoaded", function () {
    let currentUnit = 'F'; // Default unit is Fahrenheit

    // Mock data (replace with API fetch in production)
    const currentWeather = {
        temperature: (JSON.parse(localStorage.getItem("currentObservations")).properties.temperature.value * 9 / 5 + 32).toFixed(0),
        description: JSON.parse(localStorage.getItem("currentObservations")).properties.textDescription,
        icon: "☀️",
        location: localStorage.getItem("currentLocation").split(",")[2] + ", " + localStorage.getItem("currentLocation").split(",")[3],
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    };

    const hourlyWeather = [
        { time: "Now", temperature: currentWeather.temperature, icon: "☀️" },
        { time: "4:00pm", temperature: 68, icon: "🌦️" },
        { time: "5:00pm", temperature: 59, icon: "☁️" },
        { time: "6:00pm", temperature: 61, icon: "⛈️" },
        { time: "7:00pm", temperature: 71, icon: "🌧️" },
        { time: "8:00pm", temperature: 80, icon: "🌅" }
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
                <p>${hour.icon}</p>
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
    document.getElementById("current-weather-icon").innerText = currentWeather.icon;
    document.getElementById("location").innerText = `Location: ${currentWeather.location}`;
    document.getElementById("date").innerText = currentWeather.date;

    // Add event listener to the toggle button
    document.getElementById("toggleButton").addEventListener('click', toggleTemperature);

    updateTemperatureDisplay();
});
