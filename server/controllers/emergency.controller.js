const asyncHandler = require("../utils/asyncHandler");
const { getNearbyHospitals } = require("../services/matching/databaseHospitalSearch");
const { rankHospitals } = require("../services/ranking/ranking.service");

const testHospitalSearch = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius } = req.body;

  const hospitals = await getNearbyHospitals(
    Number(latitude),
    Number(longitude),
    Number(radius)


  );
  const rankedHospitals = rankHospitals(hospitals);

    res.json({
        success: true,
        total: rankedHospitals.length,
        hospitals: rankedHospitals,
    });
});

module.exports = {
  testHospitalSearch,
};