document.getElementById("otherBtn").addEventListener("click", function() {
    const inputBox = document.getElementById("locationDD");
    if (inputBox.style.display === "none") {
        inputBox.style.display = "block";
    } else {
        inputBox.style.display = "none";
    }
});


document.getElementById("currentLocationBtn").addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                city = await getCityFromCoordinates(latitude, longitude);
                localStorage.setItem("currentLocation", latitude + "," + longitude + "," + city.replace("\"", "").replace("\"", ""));
                //TODO: here send city to logic to get other data and display on UI
            },
            (error) => {
                console.error('Error getting location:', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}
)

async function getCityFromCoordinates(latitude, longitude) {
    //New API to convert lat long to city
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Data:', data);
        if (data && data.address && data.address.city) {
            console.log('City found:', data.address.city + " " + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6));
            return JSON.stringify(data.address.city) + "," + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6);
        } else if (data && data.address && data.address.town ) {
            console.log('Town found:', data.address.town + " " + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6));
            return JSON.stringify(data.address.town) + "," + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6);
        } else if (data && data.address && data.address.village) {
            console.log('Village found:', data.address.village + " " + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6));
            return JSON.stringify(data.address.village) + "," + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6);
        } else if (data && data.address && data.address.road) {
            console.log('Road found:', data.address.road + " " + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6));
            return JSON.stringify(data.address.road) + "," + JSON.stringify(data.address["ISO3166-2-lvl4"]).substring(4,6);
        } else {
            console.log('City not found for the given location.');
        }
    } catch (error) {
        console.error('Error fetching city:', error);
    }
}
