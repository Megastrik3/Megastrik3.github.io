document.addEventListener("DOMContentLoaded", function () {
    // just for now
    const currentWeather = {
        temperature: 75,
        description: "Mostly sunny",
        icon: "☀️",
        location: "Detroit, MI",
        date: "Wednesday 25, September",
    };

    const hourlyWeather = [
        { time: "Now", temperature: 75, icon: "☀️" },
        { time: "4:00pm", temperature: 68, icon: "🌦️" },
        { time: "5:00pm", temperature: 59, icon: "☁️" },
        { time: "6:00pm", temperature: 61, icon: "⛈️" },
        { time: "7:00pm", temperature: 71, icon: "🌧️" },
        { time: "8:00pm", temperature: 80, icon: "🌅" }
    ];

    document.getElementById("current-temperature").innerText = `${currentWeather.temperature}°F`;
    document.getElementById("current-description").innerText = currentWeather.description;
    document.getElementById("current-weather-icon").innerText = currentWeather.icon;
    document.getElementById("location").innerText = `Location: ${currentWeather.location}`;
    document.getElementById("date").innerText = currentWeather.date;

    const hourlyForecastContainer = document.getElementById("hourly-forecast");
    hourlyWeather.forEach((hour) => {
        const weatherBox = document.createElement("div");
        weatherBox.className = "box";
        weatherBox.innerHTML = `
            <p>${hour.time}</p>
            <h3>${hour.temperature}°F</h3>
            <p>${hour.icon}</p>
        `;
        hourlyForecastContainer.appendChild(weatherBox);
    });
});
