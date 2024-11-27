import { getWeatherStation } from "./noaa_api.js";
import { sunRiseSunSetStorageChecks } from "./sun_data.js";
import { vertexAIStorageChecks } from "./vertexAI.js";
import { moonPhaseStorageChecks } from "./moon_phase.js";

// Handle "Use My Current Location" Button
document.getElementById("currentLocationBtn").addEventListener("click", async function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("Latitude:", latitude);
                console.log("Longitude:", longitude);

                // Get city from Nominatim API
                const city = await getCityFromCoordinates(latitude, longitude);

                if (city && city !== "Unknown Location") {
                    console.log(`Current Location: ${city}`);
                    console.log(latitude, longitude)
                    // Reload associated data if location changed
                    if (localStorage.getItem("currentLocation") == null || latitude != localStorage.getItem("currentLocation").split(",")[0] || longitude != localStorage.getItem("currentLocation").split(",")[1]) {
                        localStorage.setItem(
                            "currentLocation",
                            `${latitude},${longitude},${city.replace('"', "").replace('"', "")}`
                        );
                        await getWeatherStation(true);
                        await sunRiseSunSetStorageChecks(true);
                        await vertexAIStorageChecks(true);
                        moonPhaseStorageChecks(true, () => console.log("Moon phase data loaded"));
                        console.log("Location changed.");
                    } else {
                        console.log("Location unchanged.");
                    }

                    // Close the lightbox after fetching results
                     closeLightbox();
                     window.parent.location.reload();
                } else {
                    alert("Could not determine your location. Please try again.");
                }
            },
            (error) => {
                console.error("Error getting location:", error.message);
                alert(`Geolocation error: ${error.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by your browser.");
    }
});

// Handle search for other locations (OpenCage API)
document.getElementById("searchLocationBtn").addEventListener("click", async function () {
    const searchQuery = document.getElementById("locationSelect").value.trim();
    let [savedLat, savedLon] = [0, 0];
    if (searchQuery) {
        const newLocation = (await getCityFromOpenCage(searchQuery));
        const city = newLocation.split(",")[2] + ", " + newLocation.split(",")[3];
        if (city && city !== "Unknown Location") {
            console.log(`Searched Location: ${city}`);
            saveLocation(newLocation);
            alert(`Location "${city}" added to saved locations.`);
            if (localStorage.getItem("currentLocation") !== null) {
                [savedLat, savedLon] = localStorage.getItem("currentLocation").split(",");
            }
            if (newLocation.split(",")[0] !== savedLat || newLocation.split(",")[1] !== savedLon) {
                localStorage.setItem("currentLocation", newLocation);
                await getWeatherStation(true);
                await sunRiseSunSetStorageChecks(true);
                await vertexAIStorageChecks(true);
                moonPhaseStorageChecks(true, () => console.log("Moon phase data loaded"));
            } else {
                console.log("Location unchanged.");
            }

            // Close the lightbox after fetching results
            closeLightbox();
            document.getElementById('loading-screen').style.display = 'none';
            window.parent.location.reload();
        } else {
            alert("Could not fetch location. Please try again.");
            document.getElementById("locationSelect").value = ""; // Clear input on failure
        }
    } else {
        alert("Please enter a valid location.");
    }
});

// Handle selecting a saved location
document.getElementById("savedLocationsDropdown").addEventListener("change", async function () {
    const selectedLocation = this.value;

    if (selectedLocation) {
        console.log(`Using saved location: ${selectedLocation}`);
        //alert(`Using saved location: ${selectedLocation}`);
        const [savedLat, savedLon] = localStorage.getItem("currentLocation").split(",");
        if (selectedLocation.split(",")[0] !== savedLat || selectedLocation.split(",")[1] !== savedLon) {
            localStorage.setItem("currentLocation", selectedLocation);
            await getWeatherStation(true);
            await sunRiseSunSetStorageChecks(true);
            await vertexAIStorageChecks(true);
            moonPhaseStorageChecks(true, () => console.log("Moon phase data loaded"));
            console.log("Location changed.");
        } else {
            console.log("Location unchanged.");
        }
        // Close the lightbox after selecting a saved location
        //closeLightbox();
        window.parent.location.reload();
    } else {
        alert("Please select a valid saved location.");
    }
});



// Save location to localStorage
function saveLocation(city) {
    const savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];
    if (!savedLocations.includes(city)) {
        savedLocations.push(city); // Store city name as a string
        localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
        loadSavedLocations(); // Update the dropdown
    }
}

// Load saved locations into the dropdown
function loadSavedLocations() {
    const savedLocationsDropdown = document.getElementById("savedLocationsDropdown");
    const savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];

    savedLocationsDropdown.innerHTML = '<option value="" disabled selected>Select a saved location</option>';
    savedLocations.forEach((location) => {
        const option = document.createElement("option");
        option.value = location; // Use city name as value
        option.textContent = location.split(",")[2] + ", " + location.split(",")[3]; // Display city name in dropdown
        savedLocationsDropdown.appendChild(option);
    });
}

// Utility to get city name from coordinates (Nominatim API)
async function getCityFromCoordinates(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Nominatim Response Data:", data);

        const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.hamlet ||
            data?.address?.suburb ||
            "Unknown City";

        const state = data?.address?.state || "Unknown State";

        if (city === "Unknown City" && state === "Unknown State") {
            console.log("City not found for the given location.");
            return "Unknown Location";
        }

        console.log(`Location found: ${city}, ${state}`);
        return `${city}, ${state}`;
    } catch (error) {
        console.error("Error fetching city:", error);
        return "Unknown Location";
    }
}

// Utility to get city name from OpenCage API
async function getCityFromOpenCage(query) {
    const apiKey = "b68c30cd11a64b568dff74e8ebd5c363";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&countrycode=US`;
    console.log("OpenCage API URL:", url);
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("OpenCage API Data:", JSON.stringify(data, null, 2));

        if (data.results && data.results.length > 0) {
            const city =
                data.results[0]?.components?.city ||
                data.results[0]?.components?.town ||
                data.results[0]?.components?.village ||
                data.results[0]?.formatted.split(",")[0]; // Use formatted address as fallback

            const state = data.results[0]?.components?.state || "Unknown State";
            console.log("City:", city); 
            if (city) {
                console.log(`Location found: ${city}, ${state}`);
                return `${data.results[0].geometry.lat},${data.results[0].geometry.lng},${city},${state}`;
            } else {
                console.error("No valid city found in OpenCage API response.");
                return "Unknown Location";
            }
        } else {
            console.error("No results found in OpenCage API response.");
            return "Unknown Location";
        }
    } catch (error) {
        console.error("Error fetching OpenCage data:", error);
        return "Unknown Location";
    }
}

// Close the lightbox
function closeLightbox() {
    const dropdownMenu = document.getElementById("dropdownMenu");
    const backdrop = document.getElementById("locationLightbox");

    if (dropdownMenu) {
        dropdownMenu.style.visibility = "hidden";
        dropdownMenu.style.opacity = "0";
        dropdownMenu.style.display = "none";
    } else {
        console.error("Dropdown menu element not found.");
    }

    if (backdrop) {
        backdrop.style.visibility = "hidden";
        backdrop.style.opacity = "0";
        backdrop.style.display = "none";
    } else {
        console.error("Backdrop element not found.");
    }

    console.log("Lightbox closed successfully.");
}

// Utility function to show the loading screen
function showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.style.display = "flex";
    }
}
// Initialize saved locations on page load
loadSavedLocations();
