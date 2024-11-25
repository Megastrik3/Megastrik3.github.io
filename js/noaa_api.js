import { checkLocalStorage, checkAge, getCurrentDate } from "./app.js";
let weatherStation = "";
let gridPoints = "";
let zoneID = "";

export async function getWeatherStation(forceRefresh) {
    let latitude = localStorage.getItem("currentLocation").split(",")[0];
    let longitude = localStorage.getItem("currentLocation").split(",")[1];
    try {
        const gridPointsURL = `https://api.weather.gov/points/${latitude},${longitude}`;
        const gridPointsResponse = await fetch(gridPointsURL);
        const gridPointsData = await gridPointsResponse.json();
        gridPoints = JSON.stringify(gridPointsData.properties.forecast).replace("\"", "").replace("\"", "");
        zoneID = JSON.stringify(gridPointsData.properties.forecastZone).substring(40).replace("\"", "");
        const stationsURL = `https://api.weather.gov/gridpoints/${gridPointsData.properties.cwa}/${gridPointsData.properties.gridX},${gridPointsData.properties.gridY}/stations`;
        const stationsResponse = await fetch(stationsURL);
        const stationsData = await stationsResponse.json();
        weatherStation = JSON.stringify(stationsData.observationStations[0]).replace("\"", "").replace("\"", "");
        await getCurrentObservations();
        if (!forceRefresh) {
            if (!checkLocalStorage("dailyForecast") || checkAge("daily", "dailyForecast")) {
                await getDailyWeatherForecast();
            }
            if (!checkLocalStorage("hourlyForecast") || checkAge("hourly", "hourlyForecast")) {
                await getHourlyForecast();
            }
        } else if (forceRefresh) {
            await getDailyWeatherForecast();
            await getHourlyForecast();
        }
        //await getZoneAlerts();
    } catch (error) {
        console.error('Error fetching weather grid points:', error);
    }
}

async function getCurrentObservations() {
    for (let i = 0; i < 5; i++) {
    try {
        const currentObservationsURL = weatherStation + "/observations/latest";
        const currentObservationsResponse = await fetch(currentObservationsURL);
        const currentObservationsData = await currentObservationsResponse.json();
        checkForErrors(currentObservationsData);
            localStorage.setItem("currentObservations", JSON.stringify(currentObservationsData));
            break;
    } catch (error) {
        console.error('Error fetching current conditions data:', error);
        if (i === 4) {
            alert("Error fetching current conditions data from NOAA.gov. Please try again later. If the issue persists, please contact the developer.");
        }
        continue;
    }
    }
}

async function getDailyWeatherForecast() {
    for (let i = 0; i < 5; i++) {
    try {
        const dailyForecastURL = gridPoints;
        console.log(dailyForecastURL);
        const dailyForecastResponse = await fetch(dailyForecastURL);
        const dailyForecastData = await dailyForecastResponse.json();
        checkForErrors(dailyForecastData);
        localStorage.setItem("dailyForecast", getCurrentDate(false) + "|" + JSON.stringify(dailyForecastData));
        break;
    } catch (error) {
        console.error('Error fetching daily forecast data:', error);
        if (i === 4) {
            alert("Error fetching daily forecast data from NOAA.gov. Please try again later. If the issue persists, please contact the developer.");
        }
        continue;
    }
}
}

async function getHourlyForecast() {
    for (let i = 0; i < 5; i++) {
    try {
        const hourlyForecastURL = gridPoints + "/hourly";
        const hourlyForecastResponse = await fetch(hourlyForecastURL);
        const hourlyForecastData = await hourlyForecastResponse.json();
        checkForErrors(hourlyForecastData);
        localStorage.setItem("hourlyForecast", getCurrentDate(true) + "|" + JSON.stringify(hourlyForecastData));
        break;
    } catch (error) {
        console.error('Error fetching hourly forecast data:', error);
        if (i === 4) {
            alert("Error fetching hourly forecast data from NOAA.gov. Please try again later. If the issue persists, please contact the developer.");
        }
        continue;
    }
}
}

function checkForErrors(response) {
    if (JSON.stringify(response).includes("Unexpected Problem")) {
        throw new Error("Error fetching data");
    }
}

/* TODO: Implement zone alerts */
// async function getZoneAlerts() {
//     try {
//         const zoneAlertsURL = `https://api.weather.gov/alerts`;
//         const zoneAlertsResponse = await fetch(zoneAlertsURL);
//         const zoneAlertsData = await zoneAlertsResponse.json();
//         return new Promise((resolve, reject) => {
//         localStorage.setItem("currentZoneAlerts", JSON.stringify(zoneAlertsData));
//         resolve();
//         });
//     } catch (error) {
//         console.error('Error fetching zone alerts:', error);
//     }
// }