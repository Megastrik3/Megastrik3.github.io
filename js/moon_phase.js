async function localStorageDataChecks() {
    if (!checkMoonLocalStorage() || checkDataAge()) {
        await getMoonPhase(() => {
            document.getElementById("current-moon-phase").src = localStorage.getItem("moonPhase").split("|")[1];
            displayMoonPhases();
        });
        return;
    }
    document.getElementById("current-moon-phase").src = localStorage.getItem("moonPhase").split("|")[1];
    displayMoonPhases();
}
function checkMoonLocalStorage() {
    if (localStorage.getItem("moonPhase") == null) {
        console.log("No moon data found");
        return false;
    }
    return true;
}
function getCurrentDate(getTime) {
    let date = new Date();
    let moonDate = "";
    if (parseInt(date.getMonth() + 1) < 10) {
        moonDate = moonDate + date.getFullYear() + "-0" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
    } else {
        moonDate = moonDate + date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
    }
    if (getTime == true) {
        moonDate = moonDate + "-" + date.getHours() + "-" + date.getMinutes();
    }
    console.log(moonDate);
    return moonDate;
}
function checkDataAge() {
    const dateTime = new Date();
    const getData = localStorage.getItem("moonPhase").split("|")[0];

    if (getData != getCurrentDate(true)) {
        const moonOldDate = getData.split("-");
     if (parseInt(moonOldDate[2], 10) != dateTime.getDate() || parseInt(moonOldDate[1], 10) != parseInt(dateTime.getMonth() + 1) || parseInt(moonOldDate[0], 10) != dateTime.getFullYear()) {
            console.log("Moon data more than one day old - date check");
            return true;
        }
    }
    console.log("Moon data is less than one day old");
    return false;
}

async function getMoonPhase(_callback) {
    const coordinates = localStorage.getItem("currentLocation").split(",");
    const data = `{\"style\":{\"moonStyle\":\"sketch\",\"backgroundStyle\":\"solid\",\"backgroundColor\":\"#ffffff\",\"headingColor\":\"#ffffff\",\"textColor\":\"#000000\"},\"observer\":{\"latitude\":${coordinates[0]},\"longitude\":${coordinates[1]},\"date\":\"2024-10-30\"},\"view\":{\"type\":\"landscape-simple\",\"parameters\":{}}}`;
    const moonCalendarURL = `https://aa.usno.navy.mil/api/moon/phases/date?date=${getCurrentDate(false)}&nump=5`;
    const xhr = new XMLHttpRequest();

    try {
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
              console.log(this.responseText);
              localStorage.setItem("moonPhase", getCurrentDate(false) + "|" + this.responseText.substring(21, this.responseText.indexOf(".png") + 4));
              _callback();
            }
          });
          const moonCalendarResponse = await fetch(moonCalendarURL);
          const moonPhasesCalendarData = await moonCalendarResponse.json();
          localStorage.setItem("monthMoonPhase", JSON.stringify(moonPhasesCalendarData));
          xhr.open("POST", "https://api.astronomyapi.com/api/v2/studio/moon-phase");
          xhr.setRequestHeader("Authorization", "Basic OTQ4NmY2ZjgtNTIxMC00MWQ4LWI4OWMtMjBlNDM0MzUzNjcxOjgzMmY5ZjhkNDYxYzk5Yzk5OWQwYTNmOWE2ZjkxZDdlM2E3MjcxY2MyYTBhZWE3NTQ3MzUxYmE2NGRlNWQ1YTc2MDZmMmVkOWMzYmMwNGQ3ZDI3ZmYxNTE2OTVhOGE5NDg0MWZmMjMzZmVlOTczM2I1ODhmZDkzYzUyNzE4N2JhNzc5ZjU2NTViMGVmYzI5NTFhYTdiNTZmNzNiZjI0N2Y5YjgxN2Y2MjJmYWZjMDM5OGJmNDFmOGIwNmQxMTRhYmVhYTE2MGRlZjA2NzhlN2VmYjRhYzNjYmJhMjM4Y2Rl");
          xhr.send(data);
    } catch (error) {
        console.error('Error fetching moon phases:', error);
    }

}

function displayMoonPhases(){
    const data = JSON.parse(localStorage.getItem("monthMoonPhase"));
    document.getElementById("moon-phase-text-1").innerHTML = data.phasedata[0].phase + " - " + new Date(data.phasedata[0].year, data.phasedata[0].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[0].day;
    document.getElementById("moon-phase-text-2").innerHTML = data.phasedata[1].phase + " - " + new Date(data.phasedata[1].year, data.phasedata[1].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[1].day;
    document.getElementById("moon-phase-text-3").innerHTML = data.phasedata[2].phase + " - " + new Date(data.phasedata[2].year, data.phasedata[2].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[2].day;
    document.getElementById("moon-phase-text-4").innerHTML = data.phasedata[3].phase + " - " + new Date(data.phasedata[3].year, data.phasedata[3].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[3].day;
    document.getElementById("moon-phase-text-5").innerHTML = data.phasedata[4].phase + " - " + new Date(data.phasedata[4].year, data.phasedata[4].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[4].day;
    let elementName = "-moon-phase-image";
    for (let i = 0; i < 5; i++){
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

localStorageDataChecks();