import { getCurrentDate, checkLocalStorage, checkAge } from "./app.js";
document.addEventListener("DOMContentLoaded", function () {
    localStorageDataChecks(() => displayMoonPhaseData());
});
async function localStorageDataChecks(_callback) {
    if (!checkLocalStorage("currentMoonPhase") || checkAge("currentMoonPhase")) {
        await getCurrentMoonPhase();
    }
    if (!checkLocalStorage("moonPhaseCalendar") || checkAge("moonPhaseCalendar")) {
        await getMonthlyMoonPhases();
    }
    _callback();
}
async function getCurrentMoonPhase(_callback) {
    const coordinates = localStorage.getItem("currentLocation").split(",");
    const data = `{\"style\":{\"moonStyle\":\"sketch\",\"backgroundStyle\":\"solid\",\"backgroundColor\":\"#ffffff\",\"headingColor\":\"#ffffff\",\"textColor\":\"#000000\"},\"observer\":{\"latitude\":${coordinates[0]},\"longitude\":${coordinates[1]},\"date\":\"2024-10-30\"},\"view\":{\"type\":\"landscape-simple\",\"parameters\":{}}}`;
    const xhr = new XMLHttpRequest();

    try {
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
              console.log(this.responseText);
              localStorage.setItem("currentMoonPhase", getCurrentDate(false) + "|" + this.responseText.substring(21, this.responseText.indexOf(".png") + 4));
            }
          });
          xhr.open("POST", "https://api.astronomyapi.com/api/v2/studio/moon-phase");
          xhr.setRequestHeader("Authorization", "Basic OTQ4NmY2ZjgtNTIxMC00MWQ4LWI4OWMtMjBlNDM0MzUzNjcxOjgzMmY5ZjhkNDYxYzk5Yzk5OWQwYTNmOWE2ZjkxZDdlM2E3MjcxY2MyYTBhZWE3NTQ3MzUxYmE2NGRlNWQ1YTc2MDZmMmVkOWMzYmMwNGQ3ZDI3ZmYxNTE2OTVhOGE5NDg0MWZmMjMzZmVlOTczM2I1ODhmZDkzYzUyNzE4N2JhNzc5ZjU2NTViMGVmYzI5NTFhYTdiNTZmNzNiZjI0N2Y5YjgxN2Y2MjJmYWZjMDM5OGJmNDFmOGIwNmQxMTRhYmVhYTE2MGRlZjA2NzhlN2VmYjRhYzNjYmJhMjM4Y2Rl");
          xhr.send(data);
    } catch (error) {
        console.error('Error fetching current moon phase:', error);
    }

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
        document.getElementById(`moon-phase-text-${i + 1}`).innerHTML = data.phasedata[i].phase + " - " + new Date(data.phasedata[i].year, data.phasedata[i].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[i].day;
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