/**
 * @jest-environment jsdom
 */

import { JSDOM } from "jsdom";
import "../js/current_hourly.js";
const fs = require("fs");
const path = require("path");
describe("Weather Display", () => {
    let dom;
    let document;

    beforeEach(() => {
        // Set up a basic HTML structure
        // dom = new JSDOM(`
        //     <!DOCTYPE html>
        //     <html lang="en">
        //     <body>
        //         <div id="current-temperature"></div>
        //         <div id="current-description"></div>
        //         <div id="current-weather-icon"></div>
        //         <div id="location"></div>
        //         <div id="date"></div>
        //         <div id="hourly-forecast"></div>
        //     </body>
        //     </html>
        // `);

        // document = dom.window.document;
        // Load the contents of index.html into the JSDOM instance
        const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
        dom = new JSDOM(html);
        document = dom.window.document;
        // Simulate `DOMContentLoaded` event manually since it's not automatically triggered in JSDOM
        document.addEventListener = jest.fn((event, handler) => {
            if (event === "DOMContentLoaded") handler();
        });

        require("../js/current_hourly.js");
    });

    it("should display current weather correctly", () => {
        expect(document.getElementById("current-temperature").innerHTML).toBe("--°F");
        expect(document.getElementById("current-description").innerHTML).toBe("Mostly sunny");
        expect(document.getElementById("current-weather-icon").innerHTML).toBe("☀️");
        expect(document.getElementById("location").innerHTML).toBe("Location: Detroit, MI");
        expect(document.getElementById("date").innerHTML).toBe("Wednesday 25, September");
    });

    it("should display hourly forecast correctly", () => {
        const hourlyForecastContainer = document.getElementById("hourly-forecast");
        const boxes = hourlyForecastContainer.querySelectorAll(".box");

        expect(boxes.length).toBe(6); // Check there are 6 hourly weather entries
        expect(boxes[0].innerHTML).toContain("Now");
        expect(boxes[0].innerHTML).toContain("75°F");
        expect(boxes[0].innerHTML).toContain("☀️");

        expect(boxes[1].innerHTML).toContain("4:00pm");
        expect(boxes[1].innerHTML).toContain("68°F");
        expect(boxes[1].innerHTML).toContain("🌦️");

    });
});