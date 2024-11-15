/**
 * @jest-environment jsdom
 */

import { JSDOM } from "jsdom";
import { displayWeatherData} from "../js/current_hourly.js";
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
    // document.addEventListener = jest.fn((event, handler) => {
    //     if (event === "DOMContentLoaded") handler();
    // });

    require("../js/index.js");
});

describe("updateTemperatureDispaly()", () => {

    afterEach(() => {
        return localStorage.removeItem("currentUnit");
    });

    beforeEach(() => {
        return  localStorage.setItem("currentUnit", "C");
    });

    test("toggleButton should display 'Switch to Celsius' with current-temperature is 'F'", () => {
        localStorage.setItem("currentUnit", "F");
        expect(document.getElementById("toggleButton").innerHTML).toBe("Switch to Celsius");
    });

    test("toggleButton should display 'Switch to Fahrenheit' with current-temperature is 'C'", async  () => {
        expect(document.getElementById("toggleButton").innerHTML).toBe("Switch to Fahrenheit");
    });
});