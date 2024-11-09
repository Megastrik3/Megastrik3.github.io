document.addEventListener("DOMContentLoaded", function () {
    let currentUnit = 'F'; // Default unit is Fahrenheit

    // Mock data (replace with API fetch in production)
    const currentWeather = {
        temperature: 75,
        description: "Mostly sunny",
        icon: "☀️",
        location: "Detroit, MI",
        date: "Wednesday 25, September",
        latitude: 42.3314, // Latitude for Detroit
        longitude: -83.0458 // Longitude for Detroit
    };

    const hourlyWeather = [
        { time: "Now", temperature: 75, icon: "☀️" },
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
            const temperatureCelsius = ((currentWeather.temperature - 32) * 5 / 9).toFixed(2);
            tempDisplay.innerText = `${temperatureCelsius}°C`;
            toggleButton.textContent = 'Switch to Fahrenheit';
        }

        // Update the hourly forecast with the current unit
        const hourlyForecastContainer = document.getElementById("hourly-forecast");
        hourlyForecastContainer.innerHTML = ''; // Clear existing hourly forecast
        hourlyWeather.forEach((hour) => {
            const weatherBox = document.createElement("div");
            weatherBox.className = "box";

            const temperature = currentUnit === 'F' ? hour.temperature : ((hour.temperature - 32) * 5 / 9).toFixed(2);
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

    // Function to fetch sunrise and sunset times
    async function fetchSunriseSunset() {
        const { latitude, longitude } = currentWeather;
        const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Convert sunrise and sunset from UTC to local time
            currentWeather.sunrise = convertToLocalTime(data.results.sunrise);
            currentWeather.sunset = convertToLocalTime(data.results.sunset);

            // Update sunrise and sunset times
            document.getElementById("sunrise-time").innerText = `Sunrise: ${currentWeather.sunrise}`;
            document.getElementById("sunset-time").innerText = `Sunset: ${currentWeather.sunset}`;
        } catch (error) {
            console.error("Error fetching sunrise and sunset times:", error);
        }
    }

    function convertToLocalTime(isoTime) {
        const date = new Date(isoTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    document.getElementById("current-temperature").innerText = `${currentWeather.temperature}°F`;
    document.getElementById("current-description").innerText = currentWeather.description;
    document.getElementById("current-weather-icon").innerText = currentWeather.icon;
    document.getElementById("location").innerText = `Location: ${currentWeather.location}`;
    document.getElementById("date").innerText = currentWeather.date;

    // Add event listener to the toggle button
    document.getElementById("toggleButton").addEventListener('click', toggleTemperature);

    // Fetch sunrise and sunset times when the page loads and update the temperature display
    fetchSunriseSunset();
    updateTemperatureDisplay(); 

    // Select Location Button 
    document.getElementById("SelectLocationBtn").addEventListener("click", function() {
        const lightBox = document.getElementById("locationLightbox");
        if (lightBox.style.display === "none") {
            lightBox.style.display = "block";
        } else {
            lightBox.style.display = "none";
        }
    }); 
    
});
