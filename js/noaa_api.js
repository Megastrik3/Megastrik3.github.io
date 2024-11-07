document.addEventListener('DOMContentLoaded', function(){
    getWeatherStation();
});
let weatherStation = "";
let gridPoints = "";
async function getWeatherStation(){
    let latitude = localStorage.getItem("currentLocation").split(",")[0];
    let longitude = localStorage.getItem("currentLocation").split(",")[1];
    try{
    const gridPointsURL = `https://api.weather.gov/points/${latitude},${longitude}`;
    const gridPointsResponse = await fetch(gridPointsURL);
    const gridPointsData = await gridPointsResponse.json();
    gridPoints = JSON.stringify(gridPointsData.properties.forecast).replace("\"", "").replace("\"", "");
    const stationsURL = `https://api.weather.gov/gridpoints/${gridPointsData.properties.cwa}/${gridPointsData.properties.gridX},${gridPointsData.properties.gridY}/stations`;
    const stationsResponse = await fetch(stationsURL);
    const stationsData = await stationsResponse.json();
    weatherStation = JSON.stringify(stationsData.observationStations[0]).replace("\"", "").replace("\"", "");
    getCurrentObservations();
    getDailyWeatherForecast();
    } catch (error){
        console.error('Error fetching weather grid points:', error);
    }
}

async function getCurrentObservations(){
    try{
    const currentObservationsURL = weatherStation + "/observations/latest";
    const currentObservationsResponse = await fetch(currentObservationsURL);
    const currentObservationsData = await currentObservationsResponse.json();
    localStorage.setItem("currentObservations", JSON.stringify(currentObservationsData));
    } catch (error){
        console.error('Error fetching daily forecast data:', error);
    }
}

async function getDailyWeatherForecast(){
    try{
    const dailyForecastURL = gridPoints;
    const dailyForecastResponse = await fetch(dailyForecastURL);
    const dailyForecastData = await dailyForecastResponse.json();
    localStorage.setItem("dailyForecast", JSON.stringify(dailyForecastData));
    } catch (error){
        console.error('Error fetching daily forecast data:', error);
    }
}