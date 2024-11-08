import { getCurrentDate, checkLocalStorage, checkAge } from "./app.js";

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
export async function sunRiseSunSetStorageChecks() {
    if (!checkLocalStorage("sunData") || checkAge("daily", "sunData")) {
        fetchSunriseSunset(() => displaySunData());
        return;
    }
    displaySunData();
}