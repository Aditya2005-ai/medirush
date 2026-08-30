const axios = require("axios");

async function getNearbyHospitals(lat, lng, rangeKm) {

    const radius = rangeKm * 1000;

    const query = `
    [out:json];
    (
      node
        ["amenity"="hospital"]
        (around:${radius},${lat},${lng});
      way
        ["amenity"="hospital"]
        (around:${radius},${lat},${lng});
      relation
        ["amenity"="hospital"]
        (around:${radius},${lat},${lng});
    );
    out center tags;
    `;

    const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        {
            headers: {
                "Content-Type": "text/plain"
            }
        }
    );

    return response.data.elements;
}

module.exports = {
    getNearbyHospitals
};