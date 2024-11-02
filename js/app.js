import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-vertexai-preview.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app-check.js";
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
const appCheck = initializeAppCheck(app, {
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
    const mainPrompt = "Cloudy, 55 degrees, strong wind in " + localStorage.getItem("currentLocation").split(",")[2];

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
export async function localStorageDataChecks() {
    if (!checkLocalStorage("vertexAI") || checkAge("vertexAI")) {
        await sendVertexPrompt();
    }
    displayData("advice", "vertexAI", 1);
}
export function checkLocalStorage(storageKey) {
    if (localStorage.getItem(storageKey) == null) {
        console.log(`No ${storageKey} data found`);
        return false;
    }
    return true;
}
export function checkAge(localStorageKey) {
    const dateTime = new Date();
    const getData = localStorage.getItem(localStorageKey).split("|")[0];
    if (getData == getCurrentDate(true)) {
        console.log("Data is less than one hour old");
        return false;
    }
    const localStorageTimestamp = getData.split("-");
    if (localStorageKey == "vertexAI") {
            if (parseInt(localStorageTimestamp[3], 10) + 1 <= dateTime.getHours() || parseInt(localStorageTimestamp[4], 10) >= dateTime.getMinutes() && parseInt(localStorageTimestamp[3], 10) + 1 == dateTime.getHours()) {
                console.log("Data more than one hour old -- time check");
                return true;
            } else if (parseInt(localStorageTimestamp[2], 10) != dateTime.getDate() || parseInt(localStorageTimestamp[1], 10) != parseInt(dateTime.getMonth() + 1) || parseInt(localStorageTimestamp[0], 10) != dateTime.getFullYear()) {
                console.log("Data more than one hour old - date check");
                return true;
            }
    } else if (localStorageKey == "currentMoonPhase") {
         if (parseInt(localStorageTimestamp[2], 10) != dateTime.getDate() || parseInt(localStorageTimestamp[1], 10) != parseInt(dateTime.getMonth() + 1) || parseInt(localStorageTimestamp[0], 10) != dateTime.getFullYear()) {
                console.log("Data more than one day old - date check");
                return true;
            }
    } else if (localStorageKey == "moonPhaseCalendar") {
         if (parseInt(localStorageTimestamp[1], 10) != parseInt(dateTime.getMonth() + 1) || parseInt(localStorageTimestamp[0], 10) != dateTime.getFullYear()) {
                console.log("Data more than one month old - date check");
                return true;
            }
    }
}

export function getCurrentDate(getTime) {
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

function displayData(elementName, storageName, index) {
    if (index == 0) {
        throw "Index cannot be 0";
    }
    document.getElementById(elementName).innerHTML = localStorage.getItem(storageName).split("|")[index];
}

//localStorageDataChecks();
