document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem("dailyForecast") == null) {
        window.alert("Please select a location to view the weekly forecast.");
        window.location.href = "LocationSelect.html";
    } else {
        this.getElementById("location-name").innerHTML = localStorage.getItem("currentLocation").split(",")[2];
        setWeeklyData();
    }
});

function setWeeklyData() {
    let currentUnit = 'F';
    if (localStorage.getItem("currentUnit") != null){
        currentUnit = localStorage.getItem("currentUnit");
    }

    let forecastData = JSON.parse(localStorage.getItem("dailyForecast").split("|")[1]);
const weeklyData = [
    {
        day: forecastData.properties.periods[0].name,
        icon: forecastData.properties.periods[0].icon,
        conditions: forecastData.properties.periods[0].shortForecast,
        high: forecastData.properties.periods[0].temperature,
        low: forecastData.properties.periods[1].temperature,
        shortForecast: forecastData.properties.periods[0].shortForecast
    },
    {
        day: forecastData.properties.periods[2].name,
        icon: forecastData.properties.periods[2].icon,
        conditions: forecastData.properties.periods[2].shortForecast,
        high: forecastData.properties.periods[2].temperature,
        low: forecastData.properties.periods[3].temperature,
        shortForecast: forecastData.properties.periods[2].shortForecast
    },
    {
        day: forecastData.properties.periods[4].name,
        icon: forecastData.properties.periods[4].icon,
        conditions: forecastData.properties.periods[4].shortForecast,
        high: forecastData.properties.periods[4].temperature,
        low: forecastData.properties.periods[5].temperature,
        shortForecast: forecastData.properties.periods[4].shortForecast
    },
    {
        day: forecastData.properties.periods[6].name,
        icon: forecastData.properties.periods[6].icon,
        conditions: forecastData.properties.periods[6].shortForecast,
        high: forecastData.properties.periods[6].temperature,
        low: forecastData.properties.periods[7].temperature,
        shortForecast: forecastData.properties.periods[6].shortForecast
    },
    {
        day: forecastData.properties.periods[8].name,
        icon: forecastData.properties.periods[8].icon,
        conditions: forecastData.properties.periods[8].shortForecast,
        high: forecastData.properties.periods[8].temperature,
        low: forecastData.properties.periods[9].temperature,
        shortForecast: forecastData.properties.periods[8].shortForecast
    },
    {
        day: forecastData.properties.periods[10].name,
        icon: forecastData.properties.periods[10].icon,
        conditions: forecastData.properties.periods[10].shortForecast,
        high: forecastData.properties.periods[10].temperature,
        low: forecastData.properties.periods[11].temperature,
        shortForecast: forecastData.properties.periods[10].shortForecast
    },
    {
        day: forecastData.properties.periods[12].name,
        icon: forecastData.properties.periods[12].icon,
        conditions: forecastData.properties.periods[12].shortForecast,
        high: forecastData.properties.periods[12].temperature,
        low: forecastData.properties.periods[13].temperature,
        shortForecast: forecastData.properties.periods[12].shortForecast
    }
];
const hourlyForecastContainer = document.getElementById("weekly-weather-days");
hourlyForecastContainer.innerHTML = ''; // Clear existing hourly forecast
weeklyData.forEach((day) => {
    const weatherBox = document.createElement("div");
     weatherBox.className = "day-box";
    weatherBox.id = "day-1";
    day.high = currentUnit === 'F' ? day.high : ((day.high - 32) * 5 / 9).toFixed(0);
    day.low = currentUnit === 'F' ? day.low : ((day.low - 32) * 5 / 9).toFixed(0);
    const unit = currentUnit === 'F' ? '°F' : '°C';
    weatherBox.innerHTML = `
<div class="day-box-1" id="day-1">
           <span class="day-name" id="day-1-name">${day.day}</span>
           <span class="weather-icon">
            <img id="day-1-icon" src="${day.icon}">
          </span>
         <div class="thermometer-container">
           <img src="https://static.wixstatic.com/media/1afe88_186c785494464791b83bbe846aad8ad6~mv2.png/v1/fill/w_560,h_1120,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/thermometer-gf1d839924_1280.png" alt="Thermometer" class="thermometer-icon"/> 
           <div class="temperatures"> 
          <span class="high-temp" id="day-1-temp-high">${day.high}${unit}</span>
          <span class="low-temp"id="day-1-temp-low">${day.low}${unit}</span> 
          </div>
        </div>
        <div>
                  <span class="short-forecast"id="day-1-short-forecast">${day.shortForecast}</span> 
        </div>
    `;
    hourlyForecastContainer.appendChild(weatherBox);
});


    // for (let i = 1; i <= 7; i++) {
    //     document.getElementById(`day-${i}-name`).innerHTML = weeklyData[i - 1].day;
    //     //document.getElementById(`day-${i}-name`).innerHTML = weeklyData[i-1].conditions;
    //     document.getElementById(`day-${i}-temp-high`).innerHTML = "High: " + weeklyData[i - 1].high + "°F";
    //     document.getElementById(`day-${i}-temp-low`).innerHTML = "Low: " + weeklyData[i - 1].low + "°F";
    //     document.getElementById(`day-${i}-icon`).src = weeklyData[i - 1].icon;
    //     document.getElementById(`day-${i}-short-forecast`).innerHTML = weeklyData[i - 1].shortForecast;
    // }

}
