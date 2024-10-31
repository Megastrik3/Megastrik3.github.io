async function localStorageDataChecks() {
    if (!checkMoonLocalStorage() || checkDataAge()) {
        getMoonPhase(() => document.getElementById("current-moon-phase").src = localStorage.getItem("moonPhase").split("|")[1]);
        return;
    }
    document.getElementById("current-moon-phase").src = localStorage.getItem("moonPhase").split("|")[1];
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
        const vertexOldDate = getData.split("-");
     if (parseInt(vertexOldDate[2], 10) != dateTime.getDate() || parseInt(vertexOldDate[1], 10) != parseInt(dateTime.getMonth() + 1) || parseInt(vertexOldDate[0], 10) != dateTime.getFullYear()) {
            console.log("Moon data more than one day old - date check");
            return true;
        }
    }
    console.log("Moon data is less than one day old");
    return false;
}

function getMoonPhase(_callback) {
    const coordinates = localStorage.getItem("currentLocation").split(",");
    const data = `{\"style\":{\"moonStyle\":\"sketch\",\"backgroundStyle\":\"solid\",\"backgroundColor\":\"#ffffff\",\"headingColor\":\"#ffffff\",\"textColor\":\"#000000\"},\"observer\":{\"latitude\":${coordinates[0]},\"longitude\":${coordinates[1]},\"date\":\"2024-10-30\"},\"view\":{\"type\":\"landscape-simple\",\"parameters\":{}}}`;
    const xhr = new XMLHttpRequest();
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
        localStorage.setItem("moonPhase", getCurrentDate(false) + "|" + this.responseText.substring(21, this.responseText.indexOf(".png") + 4));
        _callback();
      }
    });
    
    xhr.open("POST", "https://api.astronomyapi.com/api/v2/studio/moon-phase");
    xhr.setRequestHeader("Authorization", "Basic OTQ4NmY2ZjgtNTIxMC00MWQ4LWI4OWMtMjBlNDM0MzUzNjcxOjgzMmY5ZjhkNDYxYzk5Yzk5OWQwYTNmOWE2ZjkxZDdlM2E3MjcxY2MyYTBhZWE3NTQ3MzUxYmE2NGRlNWQ1YTc2MDZmMmVkOWMzYmMwNGQ3ZDI3ZmYxNTE2OTVhOGE5NDg0MWZmMjMzZmVlOTczM2I1ODhmZDkzYzUyNzE4N2JhNzc5ZjU2NTViMGVmYzI5NTFhYTdiNTZmNzNiZjI0N2Y5YjgxN2Y2MjJmYWZjMDM5OGJmNDFmOGIwNmQxMTRhYmVhYTE2MGRlZjA2NzhlN2VmYjRhYzNjYmJhMjM4Y2Rl");
    
    xhr.send(data);
}

async function getMoonPhaseCalendar(){
    const url = `https://aa.usno.navy.mil/api/moon/phases/date?date=${getCurrentDate(false)}&nump=5`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        document.getElementById("moon-phase-text-1").innerHTML = data.phasedata[0].phase + " - " + new Date(data.phasedata[0].year, data.phasedata[0].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[0].day;
        document.getElementById("moon-phase-text-2").innerHTML = data.phasedata[1].phase + " - " + new Date(data.phasedata[1].year, data.phasedata[1].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[1].day;
        document.getElementById("moon-phase-text-3").innerHTML = data.phasedata[2].phase + " - " + new Date(data.phasedata[2].year, data.phasedata[2].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[2].day;
        document.getElementById("moon-phase-text-4").innerHTML = data.phasedata[3].phase + " - " + new Date(data.phasedata[3].year, data.phasedata[3].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[3].day;
        document.getElementById("moon-phase-text-5").innerHTML = data.phasedata[4].phase + " - " + new Date(data.phasedata[4].year, data.phasedata[4].month -1).toLocaleString('default', { month: 'long' }) + " " + data.phasedata[4].day;
        document.getElementById("first-moon-phase-image").src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1200px-FullMoon2010.jpg";
        document.getElementById("second-moon-phase-image").src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1200px-FullMoon2010.jpg";
        document.getElementById("third-moon-phase-image").src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1200px-FullMoon2010.jpg";
        document.getElementById("fourth-moon-phase-image").src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1200px-FullMoon2010.jpg";
        document.getElementById("fifth-moon-phase-image").src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1200px-FullMoon2010.jpg";

    } catch (error) {
        console.error('Error fetching moon phases:', error);
    }
}

localStorageDataChecks();
getMoonPhaseCalendar();