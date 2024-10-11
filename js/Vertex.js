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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//prevents the api kets from being used from an unauthorized source
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LcRuF0qAAAAAEU5Edy5HY7onJBeEEJ1GV5yBsej'),
    isTokenAutoRefreshEnabled: true
});
//const analytics = getAnalytics(app);
const vertexAI = getVertexAI(app);
const model = getGenerativeModel(vertexAI, {
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

async function runVertex() {
    const prompt = "Cloudy, 55 degrees, strong wind";

    //waits for a response
    const result = await model.generateContent(prompt);
    //stores response in a variable
    const response = result.response;
    //gets the prompt response
    const text = response.text();
    const dateTime = new Date();
    const timestamp = dateTime.getDate() + "-" + dateTime.getMonth() + "-" + dateTime.getFullYear() + "-" + dateTime.getHours() + "-" + dateTime.getMinutes();
    localStorage.setItem("vertexAI", timestamp + "|" + text);

    //prints the output to the console
    console.log("New gen: " + text);

    //displays output on the webpage
    document.getElementById("vertex").innerHTML = localStorage.getItem("vertexAI").split("|")[1];
}

function localStorageDataChecks() {
    if (!checkLocalStorage()) {
        runVertex();
    } else if (checkDate()) {
        runVertex();
    }
    document.getElementById("vertex").innerHTML = localStorage.getItem("vertexAI").split("|")[1];
}

function checkLocalStorage() {
    if (localStorage.getItem("vertexAI") == null) {
        console.log("No data found");
        return false;
    }
    return true;
}

function checkDate() {
    const dateTime = new Date();
    const timestamp = dateTime.getDate() + "-" + dateTime.getMonth() + "-" + dateTime.getFullYear() + "-" + dateTime.getHours() + "-" + dateTime.getMinutes();
    const getVertexDate = localStorage.getItem("vertexAI").split("|")[0];

    if (getVertexDate != timestamp) {
        const vertexOldDate = getVertexDate.split("-");
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

localStorageDataChecks();