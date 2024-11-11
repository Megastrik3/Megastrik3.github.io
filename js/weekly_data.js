document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem("dailyForecast") == null) {
        window.alert("Please select a location to view the weekly forecast.");
        window.location.href = "LocationSelect.html";
    } else {
        setWeeklyData();
    }
});
//document.getElementById("toggleButton").addEventListener('click', setWeeklyData);
export function setWeeklyData(currentUnit) {
    if (localStorage.getItem("currentUnit") != null) {
        currentUnit = localStorage.getItem("currentUnit");
    } else {
        currentUnit = 'F';
    }

    let forecastData = JSON.parse(localStorage.getItem("dailyForecast").split("|")[1]);
    const weeklyData = [];
    for (let i = 0; i < 12; i++) {
        if (JSON.stringify(forecastData.properties.periods[i].name).includes("Night", 0)) {
            weeklyData.push({
                day: forecastData.properties.periods[i + 1].name,
                icon: forecastData.properties.periods[i + 1].icon,
                high: forecastData.properties.periods[i + 1].temperature,
                low: forecastData.properties.periods[i + 2].temperature,
                shortForecast: forecastData.properties.periods[i + 1].shortForecast,
            });
            i++;
        } else {
            weeklyData.push({
                day: forecastData.properties.periods[i].name,
                icon: forecastData.properties.periods[i].icon,
                high: forecastData.properties.periods[i].temperature,
                low: forecastData.properties.periods[i + 1].temperature,
                shortForecast: forecastData.properties.periods[i].shortForecast,
            });
        }
    }
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
                  <span class="day-name"id="day-1-short-forecast">${day.shortForecast}</span> 
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
