/**
 * @jest-environment jsdom
 */

import { JSDOM } from "jsdom";
import { displayWeatherData} from "../js/current_hourly.js";
import { sunRiseSunSetStorageChecks } from "../js/sun_data.js";
import * as webdriver from 'selenium-webdriver';
import { By, } from 'selenium-webdriver';
import exp from "constants";
import { loadConfig } from "@babel/core/lib/config/files/index.js";
const fs = require("fs");
const path = require("path");
let dom;
let document;

beforeAll(() => {
    // Load the contents of index.html into the JSDOM instance
    const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    dom = new JSDOM(html);
    document = dom.window.document;
    // Simulate `DOMContentLoaded` event manually since it's not automatically triggered in JSDOM
    document.addEventListener = jest.fn((event, handler) => {
        if (event === "DOMContentLoaded") handler();
    });
    require("../js/index.js");
    localStorage.setItem("currentLocation", "42.631168,-83.5190784,White Lake Charter Township,MI");
});

describe("updateTemperatureDispaly()", () => {

    test("toggleButton should display 'Switch to Celsius' with current-temperature is 'F", async () => {
        let driver = new webdriver.Builder().forBrowser("chrome").build();
        await driver.get('http://127.0.0.1:8080/');
        await driver.executeScript( function() {
            let date = new Date();
            localStorage.setItem("vertexAI", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        });
        await driver.switchTo().frame('locationIframe');
        await driver.findElement(By.id('currentLocationBtn')).click();
        await driver.switchTo().defaultContent();
        await driver.sleep(5000);
        //return to main page
        let toggleButton = await driver.findElement(By.id('toggleButton')).getText();
        let tempDisplay = (await driver.findElement(By.id('current-temperature')).getText()).split("°")[1];
        await driver.quit();
        expect(toggleButton).toBe("Switch to Celsius");
        expect(tempDisplay).toContain("F");
    }, 100000);

    test("toggleButton should display 'Switch to Fahrenheit' with current-temperature is 'C", async () => {
        let driver = new webdriver.Builder().forBrowser("chrome").build();
        await driver.get('http://127.0.0.1:8080/');
        await driver.executeScript( function() {
            let date = new Date();
            localStorage.setItem("vertexAI", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        });
        await driver.switchTo().frame('locationIframe');
        await driver.findElement(By.id('currentLocationBtn')).click();
        await driver.switchTo().defaultContent();
        await driver.sleep(5000);
        //return to main page
        await driver.findElement(By.id('toggleButton')).click();
        let toggleButton = await driver.findElement(By.id('toggleButton')).getText();
        let tempDisplay = (await driver.findElement(By.id('current-temperature')).getText()).split("°")[1];
        await driver.quit();
        expect(toggleButton).toBe("Switch to Fahrenheit");
        expect(tempDisplay).toContain("C");
    }, 100000);

    test("toggleButton should display 'Switch to Fahrenheit' with current-temperature is 'C' for all temperatures", async () => {
        let driver = new webdriver.Builder().forBrowser("chrome").build();
        await driver.get('http://127.0.0.1:8080/');
        await driver.executeScript( function() {
            let date = new Date();
            localStorage.setItem("vertexAI", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        });
        await driver.switchTo().frame('locationIframe');
        await driver.findElement(By.id('currentLocationBtn')).click();
        await driver.switchTo().defaultContent();
        await driver.sleep(5000);
        //return to main page
        await driver.findElement(By.id('toggleButton')).click();
        let toggleButton = await driver.findElement(By.id('toggleButton')).getText();
        let tempDisplay = (await driver.findElement(By.id('current-temperature')).getText()).split("°")[1];
        let hourlyTemp = await driver.findElement(By.id('hourly-forecast')).findElement(By.tagName('h3')).getText();
        await driver.quit();
        expect(toggleButton).toBe("Switch to Fahrenheit");
        expect(tempDisplay).toContain("C");
        expect(hourlyTemp).toContain("C");
    }, 100000);
});

describe("sunrise and sunset tests", () => {

    test("sunrise and sunset times should be displayed", async () => {
        let driver = new webdriver.Builder().forBrowser("chrome").build();
        await driver.get('http://127.0.0.1:8080/');
        await driver.executeScript( function() {
            let date = new Date();
            localStorage.setItem("vertexAI", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        });
        await driver.switchTo().frame('locationIframe');
        await driver.findElement(By.id('currentLocationBtn')).click();
        await driver.switchTo().defaultContent();
        await driver.sleep(5000);
        //return to main page
        let sunriseTime = await driver.findElement(By.id('sunrise-time')).getText();
        let sunsetTime = await driver.findElement(By.id('sunset-time')).getText();
        await driver.quit();
        expect(sunriseTime).toContain(":");
        expect(sunsetTime).toContain(":");
    }, 100000);


});

describe("location should be displayed", () => {

    test("the location field should contain a location", async () => {
        let driver = new webdriver.Builder().forBrowser("chrome").build();
        await driver.get('http://127.0.0.1:8080/');
        await driver.executeScript( function() {
            let date = new Date();
            localStorage.setItem("vertexAI", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        });
        await driver.switchTo().frame('locationIframe');
        await driver.findElement(By.id('currentLocationBtn')).click();
        await driver.switchTo().defaultContent();
        await driver.sleep(5000);
        //return to main page
        let location = await driver.findElement(By.id('location')).getText();
        await driver.quit();
        expect(location).not.toContain("--");
    }, 100000);

});

describe("current temp should be displayed", () => {

    test("the location field should contain a location", async () => {
        let driver = new webdriver.Builder().forBrowser("chrome").build();
        await driver.get('http://127.0.0.1:8080/');
        await driver.executeScript( function() {
            let date = new Date();
            localStorage.setItem("vertexAI", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        });
        await driver.switchTo().frame('locationIframe');
        await driver.findElement(By.id('currentLocationBtn')).click();
        await driver.switchTo().defaultContent();
        await driver.sleep(5000);
        //return to main page
        let currentTemp = await driver.findElement(By.id('current-temperature')).getText();
        await driver.quit();
        expect(currentTemp).not.toContain("--");
    }, 100000);

});

describe("activity suggestion should be displayed", () => {

    test("the location field should contain a location", async () => {
        let driver = new webdriver.Builder().forBrowser("chrome").build();
        await driver.get('http://127.0.0.1:8080/');
        await driver.executeScript( function() {
            let date = new Date();
            localStorage.setItem("vertexAI", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        });
        await driver.switchTo().frame('locationIframe');
        await driver.findElement(By.id('currentLocationBtn')).click();
        await driver.switchTo().defaultContent();
        await driver.sleep(5000);
        //return to main page
        let activity = await driver.findElement(By.id('advice')).getText();
        await driver.quit();
        expect(activity).not.toContain("undefined");
    }, 100000);

});

describe("check for all local storage items", () => {

    test("the location field should contain a location", async () => {
        let driver = new webdriver.Builder().forBrowser("chrome").build();
        await driver.get('http://127.0.0.1:8080/');
        await driver.executeScript( function() {
            let date = new Date();
            localStorage.setItem("vertexAI", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        });
        await driver.switchTo().frame('locationIframe');
        await driver.findElement(By.id('currentLocationBtn')).click();
        await driver.switchTo().defaultContent();
        await driver.sleep(5000);
        //return to main page
        let currentLocation = await driver.executeScript(() => localStorage.getItem("currentLocation"));
        let currentMoonPhase = await driver.executeScript(() => localStorage.getItem("currentMoonPhase"));
        let currentObservation = await driver.executeScript(() => localStorage.getItem("currentObservations"));
        let dailyForecast = await driver.executeScript(() => localStorage.getItem("dailyForecast"));
        let hourlyForecast = await driver.executeScript(() => localStorage.getItem("hourlyForecast"));
        let moonPhaseCalendar = await driver.executeScript(() => localStorage.getItem("moonPhaseCalendar"));
        let sunData = await driver.executeScript(() => localStorage.getItem("sunData"));
        let vertexAI = await driver.executeScript(() => localStorage.getItem("vertexAI"));
        await driver.quit();
        expect(currentLocation).toContain(",");
        expect(currentMoonPhase).toContain(`${new Date().getFullYear()}`);
        expect(currentObservation).toContain("{");
        expect(dailyForecast).toContain("properties\":{");
        expect(hourlyForecast).toContain("properties\":{");
        expect(moonPhaseCalendar).toContain("apiversion");
        expect(sunData).toContain(":");
        expect(vertexAI).toContain(`${new Date().getFullYear()}`);
    }, 100000);

});
