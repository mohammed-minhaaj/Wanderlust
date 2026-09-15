async function initMap() {

    const address = listingLocation;

    console.log("Searching for:", address);

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );

        const data = await response.json();

        console.log("Nominatim result:", data);

        if (data.length === 0) {
            console.log("Location not found");
            return;
        }

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        const location = {
            lat: lat,
            lng: lng
        };

        const map = new google.maps.Map(
            document.getElementById("map"),
            {
                center: location,
                zoom: 12
            }
        );

        new google.maps.Marker({
            position: location,
            map: map,
            title: address
        });

    } catch (error) {
        console.error("Geocoding error:", error);
    }
}