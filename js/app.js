import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
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
const moonPhaseAuthString = btoa(`84323f10-96d1-4383-92d6-4a0603c0ff03:832f9f8d461c99c999d0a3f9a6f91d7e3a7271cc2a0aea7547351ba64de5d5a7606f2ed9c3bc04d7d27ff151695a8a94841ff233fee9733b588fd93c527187baefbd14d2221d6f659a238399a57fd766e24d1885c337f5fc0ea856b8d9f53a974e1b0db77088c79127a0a91050746736`);
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
            { text: 'Your mission is to a give simple one sentence suggestion for good activities to be done in the provided weather conditions.' },
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

const secondaryModel = getGenerativeModel(vertexAI, {
    model: "gemini-1.5-flash", systemInstruction: {
        parts: [
            //This tells the model who it is and what it is supposed to do
            { text: 'You are a weather forecast assistant.' },
            { text: 'Your mission is to a give single activity that can be done in the provided weather conditions. For example, take a walk, or go ice skating, or relax at the beach. No commentary, no punctuation.' },
        ],
    }, safetySettings: {
        //This tells the model to block any harmful content
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_ONLY_HIGH",
    }, generationConfig: {
        //defines the randomness and size of the output.
        // 1 token is 4 characters
        maxOutputTokens: "8",
        //the degree of randomness in the output
        temperature: "2.0",
        //the degree to which the model will be random in its output
        topP: "1.0",
        //discourages the model from using tokens that already appear in the output
        presencePenalty: "1.5",
        //discourages the model from using tokens that have appear previously in the output
        frequencyPenalty: "1.99",
    },
});
async function sendVertexPrompt() {
    const mainPrompt = "Cloudy, 55 degrees, strong wind";

    //waits for a response
    const mainResult = await primaryModel.generateContent(mainPrompt);
    //stores response in a variable
    let response = mainResult.response;
    //gets the prompt response
   let text = response.text();
    const dateTime = new Date();
    const timestamp = dateTime.getDate() + "-" + dateTime.getMonth() + "-" + dateTime.getFullYear() + "-" + dateTime.getHours() + "-" + dateTime.getMinutes();
    // let secondaryText ="";
    // for (let i = 0; i < 2; i++) {
    //     const secondaryResult = await secondaryModel.generateContent(mainPrompt);
    //     //stores response in a variable
    //     response = secondaryResult.response;
    //     //gets the prompt response
    //     secondaryText = secondaryText + response.text() + "|";
    // }
    // text = text.replace(/(\r\n|\n|\r)/gm, "");
    // secondaryText = secondaryText.replace(/(\r\n|\n|\r)/gm, "");
    localStorage.setItem("vertexAI", timestamp + "|" + text);

    //prints the output to the console
    console.log("New gen: " + text);

    //displays output on the webpage
    //document.getElementById("vertex").innerHTML = localStorage.getItem("vertexAI").split("|")[1];
}
async function localStorageDataChecks() {
    if (!checkVertexLocalStorage() || checkVertexAge()) {
        await sendVertexPrompt();
    }
    document.getElementById("advice").innerHTML = localStorage.getItem("vertexAI").split("|")[1];
    // document.getElementById("activity1").innerHTML = localStorage.getItem("vertexAI").split("|")[2];
    // document.getElementById("activity2").innerHTML = localStorage.getItem("vertexAI").split("|")[3];
}
function checkVertexLocalStorage() {
    if (localStorage.getItem("vertexAI") == null) {
        console.log("No data found");
        return false;
    }
    return true;
}
function checkVertexAge() {
    const dateTime = new Date();
    const timestamp = dateTime.getDate() + "-" + dateTime.getMonth() + "-" + dateTime.getFullYear() + "-" + dateTime.getHours() + "-" + dateTime.getMinutes();
    const getVertexDate = localStorage.getItem("vertexAI").split("|")[0];

    if (getVertexDate != timestamp) {
        const vertexOldDate = getVertexDate.split("-");
        console.log(vertexOldDate[3] +1 <= dateTime.getHours());
        if (vertexOldDate[3] + 1 <= dateTime.getHours() && vertexOldDate[4] <= dateTime.getMinutes()) {
            console.log("Data more than one hour old -- minute check");
            return true;
        } else if (vertexOldDate[0] != dateTime.getDate() || vertexOldDate[1] != dateTime.getMonth() || vertexOldDate[2] != dateTime.getFullYear()) {
            console.log("Data more than one hour old - date check");
            return true;
        }
    }
    console.log("Data is recent");
    return false;
}

function getMoonPhaseImage() {
    let date = new Date();
    let moonDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    const data = `{\"style\":{\"moonStyle\":\"default\",\"backgroundStyle\":\"solid\",\"backgroundColor\":\"#ffffff\",\"headingColor\":\"#000000\",\"textColor\":\"#000000\"},\"observer\":{\"latitude\":43.778467,\"longitude\":-74.39033,\"date\":\"${moonDate}\"},\"view\":{\"type\":\"portrait-simple\",\"parameters\":{}}}`;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      }
    });
    
    xhr.open("POST", "https://api.astronomyapi.com/api/v2/studio/moon-phase");
    xhr.setRequestHeader("Authorization", "Basic " + btoa(`809b1cfe-8b23-410b-b437-4774f5831104:832f9f8d461c99c999d0a3f9a6f91d7e3a7271cc2a0aea7547351ba64de5d5a7606f2ed9c3bc04d7d27ff151695a8a94841ff233fee9733b588fd93c527187ba779f5655b0efc2951aa7b56f73bf247f9b817f622fafc0398bf41f8b06d114abeaa160def0678e7efb4ac3cbba238cde`));

    xhr.send();
}
localStorageDataChecks();
getMoonPhaseImage();