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
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                city = getCityFromCoordinates(latitude, longitude);
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

        if (data && data.address && data.address.city) {
            return data.address.city;
        } else if (data && data.address && data.address.town) {
            return data.address.town;
        } else if (data && data.address && data.address.village) {
            return data.address.village;
        } else {
            console.log('City not found for the given location.');
        }
    } catch (error) {
        console.error('Error fetching city:', error);
    }
}
