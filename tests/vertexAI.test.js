import { jest } from '@jest/globals';
import { getCurrentDate, checkLocalStorage, checkAge } from "../js/app.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-vertexai-preview.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app-check.js";
import { vertexAIStorageChecks } from '../js/vertexAI.js';

jest.mock('../js/app.js');
jest.mock("https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js");
jest.mock("https://www.gstatic.com/firebasejs/10.14.0/firebase-vertexai-preview.js");
jest.mock("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-check.js");

describe('vertexAI.js tests', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('should initialize Firebase app with correct config', () => {
        const firebaseConfig = {
            apiKey: "AIzaSyDHudbFMugPXPvSzRBEkWfeIZw8fx2WyFg",
            authDomain: "skycast-97dbd.firebaseapp.com",
            projectId: "skycast-97dbd",
            storageBucket: "skycast-97dbd.appspot.com",
            messagingSenderId: "163656577596",
            appId: "1:163656577596:web:6fb4a5a1e1c666ac28c939",
            measurementId: "G-9DTNJQNTKN"
        };
        expect(initializeApp).toHaveBeenCalledWith(firebaseConfig);
    });

    test('should call sendVertexPrompt if forceRefresh is true', async () => {
        const sendVertexPrompt = jest.fn();
        await vertexAIStorageChecks(true);
        expect(sendVertexPrompt).toHaveBeenCalled();
    });

    test('should call sendVertexPrompt if localStorage is not set or age check fails', async () => {
        checkLocalStorage.mockReturnValue(false);
        checkAge.mockReturnValue(true);
        const sendVertexPrompt = jest.fn();
        await vertexAIStorageChecks(false);
        expect(sendVertexPrompt).toHaveBeenCalled();
    });

    test('should display data if localStorage is set and age check passes', async () => {
        localStorage.setItem("vertexAI", "timestamp|test response");
        checkLocalStorage.mockReturnValue(true);
        checkAge.mockReturnValue(false);
        document.body.innerHTML = '<div id="advice"></div>';
        await vertexAIStorageChecks(false);
        expect(document.getElementById("advice").innerHTML).toBe("test response");
    });
});