document.addEventListener('DOMContentLoaded', function(){
    this.getElementById("location-name").innerHTML = localStorage.getItem("currentLocation").split(",")[2];
    setWeeklyData();
});
let forecastData = JSON.parse(localStorage.getItem("dailyForecast"));
const weeklyData = [
    { 
        day: forecastData.properties.periods[0].name,
        icon: '🌤️',
        conditions: forecastData.properties.periods[0].shortForecast,
        high: forecastData.properties.periods[0].temperature,
        low: forecastData.properties.periods[1].temperature 
    },
    { 
        day: forecastData.properties.periods[2].name,
        icon: '☀️',
        conditions: forecastData.properties.periods[2].shortForecast,
        high:  forecastData.properties.periods[2].temperature,
        low:  forecastData.properties.periods[3].temperature 
    },
    { 
        day: forecastData.properties.periods[4].name,
        icon: '🌧️',
        conditions: forecastData.properties.periods[4].shortForecast,
        high:  forecastData.properties.periods[4].temperature,
        low:  forecastData.properties.periods[5].temperature     },
    { 
        day: forecastData.properties.periods[6].name,
        icon: '⛈️',
        conditions: forecastData.properties.periods[6].shortForecast,
        high:  forecastData.properties.periods[6].temperature,
        low:  forecastData.properties.periods[7].temperature     },
    { 
        day: forecastData.properties.periods[8].name,
        icon: '🌥️',
        conditions: forecastData.properties.periods[8].shortForecast,
        high:  forecastData.properties.periods[8].temperature,
        low:  forecastData.properties.periods[9].temperature     },
    { 
        day: forecastData.properties.periods[10].name,
        icon: '☀️',
        conditions: forecastData.properties.periods[10].shortForecast,
        high:  forecastData.properties.periods[10].temperature,
        low:  forecastData.properties.periods[11].temperature     },
    { 
        day: forecastData.properties.periods[12].name,
        icon: '🌤️',
        conditions: forecastData.properties.periods[12].shortForecast,
        high:  forecastData.properties.periods[12].temperature,
        low:  forecastData.properties.periods[13].temperature     }
];
function setWeeklyData() {
    for (let i = 1; i <= 7; i++){
        document.getElementById(`day-${i}-name`).innerHTML = weeklyData[i-1].day;
        document.getElementById(`day-${i}-name`).innerHTML = weeklyData[i-1].conditions;
        document.getElementById(`day-${i}-temp-high`).innerHTML = "High: " + weeklyData[i-1].high + "°F";
        document.getElementById(`day-${i}-temp-low`).innerHTML = "Low: " + weeklyData[i-1].low + "°F";
    }

}
