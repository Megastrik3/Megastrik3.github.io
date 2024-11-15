import { getWeatherStation } from "./noaa_api.js";
import { sunRiseSunSetStorageChecks } from "./sun_data.js";
import { vertexAIStorageChecks } from "./vertexAI.js";
import { moonPhaseStorageChecks } from "./moon_phase.js";
import { setWeeklyData } from "./weekly_data.js";
import { openLocationFrame } from "./app.js";
import { displayWeatherData } from "./current_hourly.js";
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