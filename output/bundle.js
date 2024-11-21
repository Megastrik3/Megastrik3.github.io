import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getVertexAI, getGenerativeModel } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-vertexai-preview.js';
import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app-check.js';

function checkLocalStorage(storageKey) {
    if (localStorage.getItem(storageKey) == null) {
        console.log(`No ${storageKey} data found`);
        return false;
    }
    return true;
}
function checkAge(frequency, localStorageKey) {
    if (localStorageKey == "") {
        return false;
    }
    const dateTime = new Date();
    const getData = localStorage.getItem(localStorageKey).split("|")[0];
    if (getData == getCurrentDate(true) || getData == getCurrentDate(false)) {
        console.log(`Data is less than one hour old ${localStorageKey}`);
        return false;
    }
    const localStorageTimestamp = getData.split("-");
    if (frequency == "hourly") {
            if (parseInt(localStorageTimestamp[3], 10) + 1 <= dateTime.getHours() || parseInt(localStorageTimestamp[4], 10) >= dateTime.getMinutes() && parseInt(localStorageTimestamp[3], 10) + 1 >= dateTime.getHours()) {
                console.log(`Data more than one hour old -- time check ${localStorageKey}`);
                return true;
            } else if (parseInt(localStorageTimestamp[2], 10) != dateTime.getDate() || parseInt(localStorageTimestamp[1], 10) != parseInt(dateTime.getMonth() + 1) || parseInt(localStorageTimestamp[0], 10) != dateTime.getFullYear()) {
                console.log(`Data more than one hour old - date check ${localStorageKey}`);
                return true;
            }
    } else if (frequency == "daily") {
         if (parseInt(localStorageTimestamp[2], 10) != dateTime.getDate() || parseInt(localStorageTimestamp[1], 10) != parseInt(dateTime.getMonth() + 1) || parseInt(localStorageTimestamp[0], 10) != dateTime.getFullYear()) {
                console.log(`Data more than one day old - date check ${localStorageKey}`);
                return true;
            }
    } else if (frequency == "monthly") {
         if (parseInt(localStorageTimestamp[1], 10) != parseInt(dateTime.getMonth() + 1) || parseInt(localStorageTimestamp[0], 10) != dateTime.getFullYear()) {
                console.log(`Data more than one month old - date check ${localStorageKey}`);
                return true;
            }
    }
    return false;
}

function getCurrentDate(getTime) {
    let date = new Date();
    let currentDate = "";
    currentDate = currentDate + date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0');

    if (getTime == true) {
        currentDate = currentDate + "-" + date.getHours() + "-" + date.getMinutes();
    }
    return currentDate;
}

function openLocationFrame(){
    console.log("Opening location frame");
    const lightBoxContainer = document.getElementById("locationLightbox");
    lightBoxContainer.innerHTML = ''; // Clear existing hourly forecast
    const overlayIframe = document.createElement("iframe");
    overlayIframe.className = "lightbox-content";
    overlayIframe.id = "locationIframe";
    overlayIframe.src = "LocationSelect.html";
    lightBoxContainer.style.display = "block";
    lightBoxContainer.appendChild(overlayIframe);
}

let weatherStation = "";
let gridPoints = "";
let zoneID = "";

async function getWeatherStation(forceRefresh) {
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
    try {
        const currentObservationsURL = weatherStation + "/observations/latest";
        const currentObservationsResponse = await fetch(currentObservationsURL);
        const currentObservationsData = await currentObservationsResponse.json();
            localStorage.setItem("currentObservations", JSON.stringify(currentObservationsData));
    } catch (error) {
        console.error('Error fetching daily forecast data:', error);
    }
}

async function getDailyWeatherForecast() {
    try {
        const dailyForecastURL = gridPoints;
        console.log(dailyForecastURL);
        const dailyForecastResponse = await fetch(dailyForecastURL);
        const dailyForecastData = await dailyForecastResponse.json();
        localStorage.setItem("dailyForecast", getCurrentDate(false) + "|" + JSON.stringify(dailyForecastData));
    } catch (error) {
        console.error('Error fetching daily forecast data:', error);
    }
}

async function getHourlyForecast() {
    try {
        const hourlyForecastURL = gridPoints + "/hourly";
        const hourlyForecastResponse = await fetch(hourlyForecastURL);
        const hourlyForecastData = await hourlyForecastResponse.json();
        localStorage.setItem("hourlyForecast", getCurrentDate(true) + "|" + JSON.stringify(hourlyForecastData));
    } catch (error) {
        console.error('Error fetching hourly forecast data:', error);
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

// Function to fetch sunrise and sunset times
async function fetchSunriseSunset(_callback) {
    //const { latitude, longitude } = currentWeather;
    let latitude = localStorage.getItem("currentLocation").split(",")[0];
    let longitude = localStorage.getItem("currentLocation").split(",")[1];
    const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Convert sunrise and sunset from UTC to local time
        let sunrise = convertToLocalTime(data.results.sunrise);
        let sunset = convertToLocalTime(data.results.sunset);
        localStorage.setItem("sunData", getCurrentDate() + "|" + sunrise + "|" + sunset);
        _callback();
    } catch (error) {
        console.error("Error fetching sunrise and sunset times:", error);
    }
}

function displaySunData() {
    document.getElementById("sunrise-time").innerText = `Sunrise: ${localStorage.getItem("sunData").split("|")[1]}`;
    document.getElementById("sunset-time").innerText = `Sunset: ${localStorage.getItem("sunData").split("|")[2]}`;
}

function convertToLocalTime(isoTime) {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Fetch sunrise and sunset times when the page loads and update the temperature display
async function sunRiseSunSetStorageChecks(forceRefresh) {
    if (forceRefresh) {
        fetchSunriseSunset(() => console.log("Sunrise and sunset data loaded"));
        return;
    } else if (!checkLocalStorage("sunData") || checkAge("daily", "sunData")) {
        fetchSunriseSunset(() => displaySunData());
        return;
    }
    displaySunData();
}

// import { initializeApp } from 'firebase/app';
// import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyDHudbFMugPXPvSzRBEkWfeIZw8fx2WyFg",
    authDomain: "skycast-97dbd.firebaseapp.com",
    projectId: "skycast-97dbd",
    storageBucket: "skycast-97dbd.appspot.com",
    messagingSenderId: "163656577596",
    appId: "1:163656577596:web:6fb4a5a1e1c666ac28c939",
    measurementId: "G-9DTNJQNTKN"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//prevents the api kets from being used from an unauthorized source
initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LcRuF0qAAAAAEU5Edy5HY7onJBeEEJ1GV5yBsej'),
    isTokenAutoRefreshEnabled: true
});
//const analytics = getAnalytics(app);
const vertexAI = getVertexAI(app);
const primaryModel = getGenerativeModel(vertexAI, {
    model: "gemini-1.5-flash", systemInstruction: {
        parts: [
            //This tells the model who it is and what it is supposed to do
            { text: 'You are a weather forecast assistant.' },
            { text: 'Your mission is to a give simple one sentence suggestion for good activities to be done in the provided weather conditions and location.' },
        ],
    }, safetySettings: {
        //This tells the model to block any harmful content
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_ONLY_HIGH",
    }, generationConfig: {
        //defines the randomness and size of the output.
        // 1 token is 4 characters
        maxOutputTokens: "20",
        //the degree of randomness in the output
        temperature: "1.0",
        //the degree to which the model will be random in its output
        topP: "0.95",
        //discourages the model from using tokens that already appear in the output
        presencePenalty: "0.5",
        //discourages the model from using tokens that have appear previously in the output
        frequencyPenalty: "0.75",
    },
});
async function sendVertexPrompt() {
    const weatherCondtions = JSON.parse(localStorage.getItem("currentObservations"));
    const mainPrompt = `${weatherCondtions.properties.textDescription}, ${(weatherCondtions.properties.temperature.value * 9 / 5 + 32).toFixed(0)} degrees fahrenheit, ${weatherCondtions.properties.windSpeed.value} km/h wind speed in ${localStorage.getItem("currentLocation").split(",")[2]}`;
    console.log("Prompt: " + mainPrompt);
    //waits for a response
    const mainResult = await primaryModel.generateContent(mainPrompt);
    //stores response in a variable
    let response = mainResult.response;
    //gets the prompt response
   let text = response.text();
    const timestamp = getCurrentDate(true);
    localStorage.setItem("vertexAI", timestamp + "|" + text);

    //prints the output to the console
    console.log("New gen: " + text);
}

function displayData(elementName, storageName, index) {
    document.getElementById(elementName).innerHTML = localStorage.getItem(storageName).split("|")[index];
}
async function vertexAIStorageChecks(forceRefresh) {
    if (forceRefresh) {
        await sendVertexPrompt();
        return;
    } else if (!checkLocalStorage("vertexAI") || checkAge("hourly", "vertexAI")) {
        await sendVertexPrompt();
    }
    displayData("advice", "vertexAI", 1);
}

const moonPhaseAPI = btoa("809b1cfe-8b23-410b-b437-4774f5831104:832f9f8d461c99c999d0a3f9a6f91d7e3a7271cc2a0aea7547351ba64de5d5a7606f2ed9c3bc04d7d27ff151695a8a94841ff233fee9733b588fd93c527187ba08e9317940f49691a5f5d1657f089e3efa1a178f5abe7c7fc85bcc7e9ad23ac143533761cd895ae86d2018d00c885a95");
window.addEventListener("DOMConentLoaded", async function () {
    if (window.location.pathname == "/moon-phase.html") {
        await moonPhaseStorageChecks(false, () => displayMoonPhaseData());
    }
});
if (window.location.pathname == "/moon-phase.html") {
    window.onload = async function () {
        await moonPhaseStorageChecks(false, () => displayMoonPhaseData());
    };
}
async function moonPhaseStorageChecks(forceRefresh, _callback) {
    if (forceRefresh) {
        await getCurrentMoonPhase();
        await getMonthlyMoonPhases();
        return;
    } else {
        if (!checkLocalStorage("currentMoonPhase") || checkAge("daily", "currentMoonPhase")) {
            await getCurrentMoonPhase();
        }
        if (!checkLocalStorage("moonPhaseCalendar") || checkAge("monthly", "moonPhaseCalendar")) {
            await getMonthlyMoonPhases();
        }
    }
    _callback();
}
async function getCurrentMoonPhase() {
    const coordinates = localStorage.getItem("currentLocation").split(",");
    const data = JSON.stringify({
        "style": {
            "moonStyle": "default",
            "backgroundStyle": "solid",
            "backgroundColor": "#ffffff",
            "headingColor": "#ffffff",
            "textColor": "#000000"
        },
        "observer": {
            "latitude": parseFloat(coordinates[0]),
            "longitude": parseFloat(coordinates[1]),
            "date": getCurrentDate(false)
        },
        "view": {
            "type": "landscape-simple",
            "parameters": {}
        },
    });

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                localStorage.setItem("currentMoonPhase", getCurrentDate(false) + "|" + this.responseText.substring(21, this.responseText.indexOf(".png") + 4));
                resolve();
            }
        });
        xhr.onerror = () => reject(new Error('XHR request failed'));
        xhr.open("POST", "https://api.astronomyapi.com/api/v2/studio/moon-phase");
        xhr.setRequestHeader("Authorization", "Basic " + moonPhaseAPI);
        xhr.send(data);
    });
}

async function getMonthlyMoonPhases() {
    try {
        const moonCalendarURL = `https://aa.usno.navy.mil/api/moon/phases/date?date=${getCurrentDate(false)}&nump=5`;
        const moonCalendarResponse = await fetch(moonCalendarURL);
        const moonPhasesCalendarData = await moonCalendarResponse.json();
        localStorage.setItem("moonPhaseCalendar", getCurrentDate() + "|" + JSON.stringify(moonPhasesCalendarData));
    } catch (error) {
        console.error('Error fetching monthly moon phases:', error);
    }
}
function displayMoonPhaseData() {
    document.getElementById("current-moon-phase").src = localStorage.getItem("currentMoonPhase").split("|")[1];
    const data = JSON.parse(localStorage.getItem("moonPhaseCalendar").split("|")[1]);
    for (let i = 0; i < 5; i++) {
        document.getElementById(`moon-phase-text-${i + 1}`).innerHTML = data.phasedata[i].phase + " - " + new Date(data.phasedata[i].year, data.phasedata[i].month - 1, data.phasedata[i].day).toLocaleString('en-US', { month: 'long', day: 'numeric' });
        if (data.phasedata[i].phase == "New Moon") {
            document.getElementById(`${i + 1}-moon-phase-image`).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Fase_1.jpg/598px-Fase_1.jpg?20161001004830";
            document.getElementById(`${i + 1}-moon-phase-image`).title = "Source Henrykus on Wikimedia Commons: https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Fase_1.jpg/598px-Fase_1.jpg?20161001004830";
        } else if (data.phasedata[i].phase == "First Quarter") {
            document.getElementById(`${i + 1}-moon-phase-image`).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Fase_13.jpg/598px-Fase_13.jpg?20161001005404";
            document.getElementById(`${i + 1}-moon-phase-image`).title = "Source Henrykus on Wikimedia Commons: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Fase_13.jpg/598px-Fase_13.jpg?20161001005404";
        } else if (data.phasedata[i].phase == "Full Moon") {
            document.getElementById(`${i + 1}-moon-phase-image`).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fase_9.jpg/598px-Fase_9.jpg?20161001005227";
            document.getElementById(`${i + 1}-moon-phase-image`).title = "Source Henrykus on Wikimedia Commons: https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fase_9.jpg/598px-Fase_9.jpg?20161001005227";
        } else if (data.phasedata[i].phase == "Last Quarter") {
            document.getElementById(`${i + 1}-moon-phase-image`).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Fase_6.jpg/598px-Fase_6.jpg?20161001005118";
            document.getElementById(`${i + 1}-moon-phase-image`).title = "Source Henrykus on Wikimedia Commons: https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Fase_6.jpg/598px-Fase_6.jpg?20161001005118";
        }
    }
}

// document.addEventListener('DOMContentLoaded', function () {
//     if (localStorage.getItem("currentLocation") == null) {
//         window.alert("Please select a location to view the weekly forecast.");
//         openLocationFrame();
//     } else {
//         setWeeklyData();
//     }
// });
function setWeeklyData(currentUnit) {
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

async function displayWeatherData() {
    let currentUnit = ""; // Default unit is Fahrenheit
    if (localStorage.getItem("currentUnit") != null) {
        currentUnit = localStorage.getItem("currentUnit");
    } else {
        localStorage.setItem("currentUnit", "F");
        currentUnit = "F";
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


    // Fetch sunrise and sunset times when the page loads and update the temperature display
    sunRiseSunSetStorageChecks();
    updateTemperatureDisplay();

    // Select Location Button 
    document.getElementById("SelectLocationBtn").addEventListener("click", function (){
        openLocationFrame();
    });
    
}

if (window.frameElement == "locationIframe"){
document.getElementById("otherBtn").addEventListener("click", function() {
    const inputBox = document.getElementById("locationDD");
    if (inputBox.style.display === "none") {
        inputBox.style.display = "block";
    } else {
        inputBox.style.display = "none";
    }
});


document.getElementById("currentLocationBtn").addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const city = await getCityFromCoordinates(latitude, longitude);
                localStorage.setItem("currentLocation", latitude + "," + longitude + "," + city.replace("\"", "").replace("\"", ""));
                if (latitude != localStorage.getItem("currentLocation").split(",")[0] || longitude != localStorage.getItem("currentLocation").split(",")[1]) {
                await getWeatherStation(true);
                await sunRiseSunSetStorageChecks(true);
                await vertexAIStorageChecks(true);
                moonPhaseStorageChecks(true, () => console.log("Moon phase data loaded"));
                } else {
                    console.log("Location unchanged.");
                }
                window.parent.location.reload();
            },
            (error) => {
                console.error('Error getting location:', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}
);

async function getCityFromCoordinates(latitude, longitude) {
    //New API to convert lat long to city
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Data:', data);
        if (data && data.address && data.address.city) {
            console.log('City found:', data.address.city + " " + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6));
            return JSON.stringify(data.address.city) + "," + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6);
        } else if (data && data.address && data.address.town ) {
            console.log('Town found:', data.address.town + " " + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6));
            return JSON.stringify(data.address.town) + "," + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6);
        } else if (data && data.address && data.address.village) {
            console.log('Village found:', data.address.village + " " + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6));
            return JSON.stringify(data.address.village) + "," + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6);
        } else if (data && data.address && data.address.road) {
            console.log('Road found:', data.address.road + " " + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6));
            return JSON.stringify(data.address.road) + "," + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6);
        } else {
            console.log('City not found for the given location.');
        }
    } catch (error) {
        console.error('Error fetching city:', error);
    }
}
}

document.addEventListener("DOMContentLoaded", async function () {
    // if there is not a current location set, force the user to select a location
    if (localStorage.getItem("currentLocation") == null) {
        openLocationFrame();
        console.log("Please select a location to view the weekly forecast.");
    } else {
        try {
            await getWeatherStation(false);
            await sunRiseSunSetStorageChecks(false);
            await vertexAIStorageChecks(false);
            setWeeklyData();
            displayWeatherData();
            moonPhaseStorageChecks(false, () => console.log("Moon phase data loaded"));
        } catch (error) { 
            console.error('Error fetching data:', error);
        }
    }

});
