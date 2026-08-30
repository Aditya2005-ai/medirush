const prisma = require("../../config/db");

function distanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

async function getNearbyHospitals(latitude, longitude, radiusKm) {
  const hospitals = await prisma.hospitals.findMany({
    where: {
      profile_completed: true,
      is_verified: false, // demo ke liye false hi rakho, baad me true karenge
    },

    include: {
      hospital_profiles: true,
      hospital_resources: true,
      hospital_doctors: true,
      hospital_departments: true,
      hospital_equipment: true,
    },
  });

  const nearby = [];

  for (const hospital of hospitals) {
    if (!hospital.hospital_profiles) continue;

    const profile = hospital.hospital_profiles;

    const distance = distanceInKm(
      latitude,
      longitude,
      Number(profile.latitude),
      Number(profile.longitude)
    );

    if (distance > radiusKm) continue;

    nearby.push({
      id: hospital.id,

      hospitalName: hospital.hospital_name,

      distance: Number(distance.toFixed(2)),

      address: profile.address,

      city: profile.city,

      latitude: Number(profile.latitude),

      longitude: Number(profile.longitude),

      resources: hospital.hospital_resources,

      doctors: hospital.hospital_doctors,

      departments: hospital.hospital_departments,

      equipment: hospital.hospital_equipment,
    });
  }

  nearby.sort((a, b) => a.distance - b.distance);

  return nearby;
}

module.exports = {
  getNearbyHospitals,
};