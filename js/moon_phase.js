import { getCurrentDate, checkLocalStorage, checkAge } from "./app.js";
const moonPhaseAPI = btoa("809b1cfe-8b23-410b-b437-4774f5831104:832f9f8d461c99c999d0a3f9a6f91d7e3a7271cc2a0aea7547351ba64de5d5a7606f2ed9c3bc04d7d27ff151695a8a94841ff233fee9733b588fd93c527187ba08e9317940f49691a5f5d1657f089e3efa1a178f5abe7c7fc85bcc7e9ad23ac143533761cd895ae86d2018d00c885a95");
document.addEventListener("DOMContentLoaded", async function () {
    if (window.location.pathname == "/moon-phase.html") {
    await moonPhaseStorageChecks(() => displayMoonPhaseData());
    }
});
export async function moonPhaseStorageChecks(_callback) {
        if (!checkLocalStorage("currentMoonPhase") || checkAge("daily", "currentMoonPhase")) {
            await getCurrentMoonPhase();
        }
        if (!checkLocalStorage("moonPhaseCalendar") || checkAge("monthly", "moonPhaseCalendar")) {
            await getMonthlyMoonPhases();
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

async function getMonthlyMoonPhases(){
    try{
    const moonCalendarURL = `https://aa.usno.navy.mil/api/moon/phases/date?date=${getCurrentDate(false)}&nump=5`;
    const moonCalendarResponse = await fetch(moonCalendarURL);
    const moonPhasesCalendarData = await moonCalendarResponse.json();
    localStorage.setItem("moonPhaseCalendar", getCurrentDate() + "|" + JSON.stringify(moonPhasesCalendarData));
    } catch (error){
        console.error('Error fetching monthly moon phases:', error);
    }
}
function displayMoonPhaseData(){
    document.getElementById("current-moon-phase").src = localStorage.getItem("currentMoonPhase").split("|")[1];
    const data = JSON.parse(localStorage.getItem("moonPhaseCalendar").split("|")[1]);
    for (let i = 0; i < 5; i++){
        document.getElementById(`moon-phase-text-${i + 1}`).innerHTML = data.phasedata[i].phase + " - " + new Date(data.phasedata[i].year, data.phasedata[i].month -1, data.phasedata[i].day).toLocaleString('en-US', { month: 'long', day: 'numeric' });
        if (data.phasedata[i].phase == "New Moon"){
            document.getElementById(`${i + 1}-moon-phase-image`).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Fase_1.jpg/598px-Fase_1.jpg?20161001004830";
            document.getElementById(`${i + 1}-moon-phase-image`).title = "Source Henrykus on Wikimedia Commons: https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Fase_1.jpg/598px-Fase_1.jpg?20161001004830";
        } else if (data.phasedata[i].phase == "First Quarter"){
            document.getElementById(`${i + 1}-moon-phase-image`).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Fase_13.jpg/598px-Fase_13.jpg?20161001005404";
            document.getElementById(`${i + 1}-moon-phase-image`).title = "Source Henrykus on Wikimedia Commons: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Fase_13.jpg/598px-Fase_13.jpg?20161001005404";
        } else if (data.phasedata[i].phase == "Full Moon"){
            document.getElementById(`${i + 1}-moon-phase-image`).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fase_9.jpg/598px-Fase_9.jpg?20161001005227";
            document.getElementById(`${i + 1}-moon-phase-image`).title = "Source Henrykus on Wikimedia Commons: https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fase_9.jpg/598px-Fase_9.jpg?20161001005227";
        } else if (data.phasedata[i].phase == "Last Quarter"){
            document.getElementById(`${i + 1}-moon-phase-image`).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Fase_6.jpg/598px-Fase_6.jpg?20161001005118";
            document.getElementById(`${i + 1}-moon-phase-image`).title = "Source Henrykus on Wikimedia Commons: https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Fase_6.jpg/598px-Fase_6.jpg?20161001005118";
        }
    }
}
