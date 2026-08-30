function calculateHospitalScore(hospital) {
  let score = 0;

  const resources = hospital.resources;

  // Distance (40)
  score += Math.max(0, 40 - hospital.distance * 2);

  // ICU (20)
  score += Math.min(resources?.available_icu_beds || 0, 20);

  // Emergency Beds (15)
  score += Math.min(resources?.available_emergency_beds || 0, 15);

  // Ventilators (10)
  score += Math.min(resources?.available_ventilators || 0, 10);

  // Doctors (10)
  const availableDoctors = hospital.doctors.reduce(
    (sum, doctor) => sum + doctor.available_doctors,
    0
  );

  score += Math.min(availableDoctors, 10);

  // Blood Bank (5)
  if (resources?.blood_bank_available) {
    score += 5;
  }

  return Math.round(score);
}

function rankHospitals(hospitals) {
  return hospitals
    .map((hospital) => ({
      ...hospital,
      score: calculateHospitalScore(hospital),
    }))
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  rankHospitals,
};