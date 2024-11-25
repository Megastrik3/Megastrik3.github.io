import { moonPhaseStorageChecks, getCurrentMoonPhase, getMonthlyMoonPhases } from "../js/moon_phase.js";

document.body.innerHTML = `
  <img id="current-moon-phase" />
  <div id="moon-phase-text-1"></div>
  <div id="moon-phase-text-2"></div>
  <div id="moon-phase-text-3"></div>
  <div id="moon-phase-text-4"></div>
  <div id="moon-phase-text-5"></div>
  <img id="1-moon-phase-image" />
  <img id="2-moon-phase-image" />
  <img id="3-moon-phase-image" />
  <img id="4-moon-phase-image" />
  <img id="5-moon-phase-image" />
`;

jest.mock("../js/moon_phase.js", () => ({
  getCurrentMoonPhase: jest.fn(),
  getMonthlyMoonPhases: jest.fn(),
  moonPhaseStorageChecks: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      phasedata: [
        { phase: "New Moon", year: 2024, month: 11, day: 1 },
        { phase: "First Quarter", year: 2024, month: 11, day: 8 },
        { phase: "Full Moon", year: 2024, month: 11, day: 15 },
        { phase: "Last Quarter", year: 2024, month: 11, day: 22 },
        { phase: "New Moon", year: 2024, month: 11, day: 29 },
      ],
    }),
  })
);

describe("moon_phase.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call moonPhaseStorageChecks and getCurrentMoonPhase when forceRefresh is true", async () => {
    const callback = jest.fn();

    await moonPhaseStorageChecks(true, callback);

    expect(getCurrentMoonPhase).toHaveBeenCalled();
    expect(getMonthlyMoonPhases).toHaveBeenCalled();

    expect(callback).toHaveBeenCalled();
  });

  it("should fetch and display the moon phase data when moonPhaseStorageChecks is called", async () => {
    const callback = jest.fn();

    const mockMoonPhasesData = {
      phasedata: [
        { phase: "New Moon", year: 2024, month: 11, day: 1 },
        { phase: "First Quarter", year: 2024, month: 11, day: 8 },
        { phase: "Full Moon", year: 2024, month: 11, day: 15 },
        { phase: "Last Quarter", year: 2024, month: 11, day: 22 },
        { phase: "New Moon", year: 2024, month: 11, day: 29 },
      ]
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockMoonPhasesData)
    });

    await moonPhaseStorageChecks(false, callback);

    expect(callback).toHaveBeenCalled();

    expect(document.getElementById("moon-phase-text-1").innerHTML).toBe("New Moon - November 1, 2024");
    expect(document.getElementById("moon-phase-text-2").innerHTML).toBe("First Quarter - November 8, 2024");
    expect(document.getElementById("moon-phase-text-3").innerHTML).toBe("Full Moon - November 15, 2024");
    expect(document.getElementById("moon-phase-text-4").innerHTML).toBe("Last Quarter - November 22, 2024");
    expect(document.getElementById("moon-phase-text-5").innerHTML).toBe("New Moon - November 29, 2024");

    expect(document.getElementById("1-moon-phase-image").src).toContain("Fase_1.jpg");
    expect(document.getElementById("2-moon-phase-image").src).toContain("Fase_13.jpg");
    expect(document.getElementById("3-moon-phase-image").src).toContain("Fase_9.jpg");
    expect(document.getElementById("4-moon-phase-image").src).toContain("Fase_6.jpg");
    expect(document.getElementById("5-moon-phase-image").src).toContain("Fase_1.jpg");
  });

  it("should handle the XHR error correctly if getCurrentMoonPhase fails", async () => {
    getCurrentMoonPhase.mockRejectedValueOnce(new Error("XHR request failed"));

    console.error = jest.fn();

    try {
      await getCurrentMoonPhase();
    } catch (e) {
      expect(console.error).toHaveBeenCalledWith("XHR request failed");
    }
  });

  it("should handle fetch errors correctly when fetching monthly moon phases", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch monthly moon phases"));

    console.error = jest.fn();

    await getMonthlyMoonPhases();

    expect(console.error).toHaveBeenCalledWith("Error fetching monthly moon phases:", expect.any(Error));
  });
});