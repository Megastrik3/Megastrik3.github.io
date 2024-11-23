import { getWeatherStation } from "../js/noaa_api.js";
import { sunRiseSunSetStorageChecks } from "../js/sun_data.js";
import { vertexAIStorageChecks } from "../js/vertexAI.js";
import { moonPhaseStorageChecks } from "../js/moon_phase.js";

// Mocking the DOM elements that the script interacts with
document.body.innerHTML = `
  <button id="otherBtn">Toggle Location</button>
  <button id="currentLocationBtn">Set Current Location</button>
  <div id="locationDD" style="display:none">Location Dropdown</div>
`;
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        address: {
          city: "Test City",
          "ISO3166-2-lvl4": "US-CA",
        },
      }),
  })
);

global.navigator.geolocation = {
  getCurrentPosition: jest.fn((success) =>
    success({
      coords: { latitude: 34.0522, longitude: -118.2437 },
    })
  ),
};

jest.mock("../js/noaa_api.js", () => ({
  getWeatherStation: jest.fn(),
}));

jest.mock("../js/sun_data.js", () => ({
  sunRiseSunSetStorageChecks: jest.fn(),
}));

jest.mock("../js/vertexAI.js", () => ({
  vertexAIStorageChecks: jest.fn(),
}));

jest.mock("../js/moon_phase.js", () => ({
  moonPhaseStorageChecks: jest.fn(),
}));

describe("location_script.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should toggle the location dropdown visibility when 'otherBtn' is clicked", () => {
    document.addEventListener('DOMContentLoaded', () => {
      const locationDD = document.getElementById("locationDD");
      const toggleButton = document.getElementById("otherBtn");
  
      expect(locationDD.style.display).toBe("none");
  
      toggleButton.click();
  
      expect(locationDD.style.display).toBe("block");
  
      toggleButton.click();
      expect(locationDD.style.display).toBe("none");
    });
  });

  it("should call geolocation and fetch city when 'currentLocationBtn' is clicked", async () => {
    document.addEventListener('DOMContentLoaded', async () => {
      const setLocationButton = document.getElementById("currentLocationBtn");

      setLocationButton.click();
  
      await Promise.resolve();
  
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  
      expect(fetch).toHaveBeenCalledWith(
        "https://nominatim.openstreetmap.org/reverse?lat=34.0522&lon=-118.2437&format=json"
      );
  
      expect(getWeatherStation).toHaveBeenCalledWith(true);
      expect(sunRiseSunSetStorageChecks).toHaveBeenCalledWith(true);
      expect(vertexAIStorageChecks).toHaveBeenCalledWith(true);
      expect(moonPhaseStorageChecks).toHaveBeenCalledWith(true, expect.any(Function));
  
      expect(window.parent.location.reload).toBeCalled();
    });
  });

  it("should not trigger API calls if location is unchanged", async () => {
    document.addEventListener('DOMContentLoaded', async () => {
      const setLocationButton = document.getElementById("currentLocationBtn");

      navigator.geolocation.getCurrentPosition = jest.fn((success) =>
        success({
          coords: { latitude: 34.0522, longitude: -118.2437 },
        })
      );
  
      setLocationButton.click();
  
      await Promise.resolve();
  
      expect(getWeatherStation).not.toHaveBeenCalled();
      expect(sunRiseSunSetStorageChecks).not.toHaveBeenCalled();
      expect(vertexAIStorageChecks).not.toHaveBeenCalled();
      expect(moonPhaseStorageChecks).not.toHaveBeenCalled();
    });
  });
});