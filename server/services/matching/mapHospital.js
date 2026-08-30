module.exports = function mapHospital(place) {
    return {
        id: String(place.id),

        name: place.tags?.name || "Hospital",

        lat: Number(place.lat),

        lng: Number(place.lon),

        address: place.tags?.["addr:full"] ||
                 place.tags?.street ||
                 "Address unavailable",

        phone: place.tags?.phone || "N/A",

        speciality: "General",

        rating: (3.8 + Math.random()).toFixed(1),

        // Fake bed data for demo purposes
        beds: {
            icu: Math.floor(Math.random() * 8) + 1,
            emergency: Math.floor(Math.random() * 15) + 1,
            general: Math.floor(Math.random() * 40) + 10,
            ventilator: Math.floor(Math.random() * 6) + 1,
            maternity: Math.floor(Math.random() * 5)
        }
    };
};