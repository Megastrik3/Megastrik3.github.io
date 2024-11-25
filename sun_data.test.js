import { sunRiseSunSetStorageChecks } from "../js/sun_data.js";
import { checkLocalStorage, checkAge, getCurrentDate } from "../js/app.js";

global.fetch = jest.fn();

beforeEach(() => {
  Object.defineProperty(global, 'localStorage', {
    value: {
      getItem: jest.fn().mockImplementation((key) => {
        if (key === 'currentLocation') {
          return '40.7128,-74.0060';
        }
        if (key === 'sunData') {
          return '2024-11-01|06:30 AM|06:00 PM';
        }
        return null;
      }),
      setItem: jest.fn(),
    },
    writable: true,
  });

  jest.clearAllMocks();
});

jest.mock("../js/app.js", () => ({
  checkLocalStorage: jest.fn(),
  checkAge: jest.fn(),
  getCurrentDate: jest.fn(),
}));

describe("sun_data.js", () => {
  it("should fetch sunrise and sunset times when forceRefresh is true", async () => {
    const mockSunriseSunsetResponse = {
      results: {
        sunrise: "2024-11-01T11:30:00+00:00",
        sunset: "2024-11-01T23:00:00+00:00"
      }
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockSunriseSunsetResponse)
    });

    const callback = jest.fn();

    getCurrentDate.mockReturnValue('2024-11-01');

    await sunRiseSunSetStorageChecks(true);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.sunrise-sunset.org/json?lat=40.7128&lng=-74.0060&formatted=0"
    );

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "sunData",
      expect.stringContaining("2024-11-01")
    );

    expect(callback).toHaveBeenCalled();
  });

  it("should fetch sunrise and sunset times if sunData is missing or expired", async () => {
    const mockSunriseSunsetResponse = {
      results: {
        sunrise: "2024-11-01T11:30:00+00:00",
        sunset: "2024-11-01T23:00:00+00:00"
      }
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockSunriseSunsetResponse)
    });

    checkLocalStorage.mockReturnValue(false);
    checkAge.mockReturnValue(true);

    const callback = jest.fn();

    getCurrentDate.mockReturnValue('2024-11-01');

    await sunRiseSunSetStorageChecks(false);

    expect(fetch).toHaveBeenCalled();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "sunData",
      expect.stringContaining("2024-11-01")
    );

    expect(callback).toHaveBeenCalled();
  });

  it("should display the sun data from localStorage when it's available and valid", async () => {
    const mockSunriseSunsetResponse = {
      results: {
        sunrise: "2024-11-01T11:30:00+00:00",
        sunset: "2024-11-01T23:00:00+00:00"
      }
    };

    checkLocalStorage.mockReturnValue(true);
    checkAge.mockReturnValue(false);

    document.body.innerHTML = `
      <div id="sunrise-time"></div>
      <div id="sunset-time"></div>
    `;

    getCurrentDate.mockReturnValue('2024-11-01');

    await sunRiseSunSetStorageChecks(false);

    expect(document.getElementById("sunrise-time").innerText).toBe("Sunrise: 06:30 AM");
    expect(document.getElementById("sunset-time").innerText).toBe("Sunset: 06:00 PM");

    expect(fetch).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully if fetching sunrise and sunset data fails", async () => {

    fetch.mockRejectedValueOnce(new Error("Failed to fetch sunrise and sunset data"));

    const callback = jest.fn();

    getCurrentDate.mockReturnValue('2024-11-01');

    console.error = jest.fn();

    await sunRiseSunSetStorageChecks(true);

    expect(console.error).toHaveBeenCalledWith("Error fetching sunrise and sunset times:", expect.any(Error));

    expect(callback).not.toHaveBeenCalled();
  });
});