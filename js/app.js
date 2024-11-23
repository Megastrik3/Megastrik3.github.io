export function checkLocalStorage(storageKey) {
    if (localStorage.getItem(storageKey) == null) {
        console.log(`No ${storageKey} data found`);
        return false;
    }
    return true;
}
export function checkAge(frequency, localStorageKey) {
    const dateTime = new Date();
    let i = 0;
    const getData = localStorage.getItem(localStorageKey).split("|")[0];
    if (getData == getCurrentDate(true) || getData == getCurrentDate(false)) {
        console.log(`Data is less than one hour old ${localStorageKey}`);
        return false;
    }
    const localStorageTimestamp = getData.split("-");
    if (dateTime.getHours() == 0) {
        i = 24;
    }
    if (frequency == "hourly") {
            if (parseInt(localStorageTimestamp[3], 10) + 1 < dateTime.getHours() + i || parseInt(localStorageTimestamp[4], 10) >= dateTime.getMinutes() && parseInt(localStorageTimestamp[3], 10) + 1 == dateTime.getHours() + i) {
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

export function getCurrentDate(getTime) {
    let date = new Date();
    let currentDate = "";
    currentDate = currentDate + date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0');

    if (getTime == true) {
        currentDate = currentDate + "-" + date.getHours() + "-" + date.getMinutes();
    }
    return currentDate;
}

export function openLocationFrame(){
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
