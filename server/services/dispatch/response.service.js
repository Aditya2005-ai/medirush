const prisma = require("../../config/db");

/**
 * Hospital Accept / Reject Response
 */
const saveHospitalResponse = async ({
  requestId,
  hospitalId,
  status,
  score = null,
  responseTimeMs = null,
  rejectionReason = null,
}) => {
  return await prisma.hospital_responses.upsert({
    where: {
      request_id_hospital_id: {
        request_id: requestId,
        hospital_id: hospitalId,
      },
    },

    update: {
      status,
      score,
      response_time_ms: responseTimeMs,
      rejection_reason: rejectionReason,
      responded_at: new Date(),
    },

    create: {
      request_id: requestId,
      hospital_id: hospitalId,
      status,
      score,
      response_time_ms: responseTimeMs,
      rejection_reason: rejectionReason,
      responded_at: new Date(),
    },
  });
};

/**
 * Mark remaining hospitals as NO_RESPONSE
 */
const markNoResponseHospitals = async (
  requestId,
  nearbyHospitals
) => {
  for (const hospital of nearbyHospitals) {
    const existing =
      await prisma.hospital_responses.findUnique({
        where: {
          request_id_hospital_id: {
            request_id: requestId,
            hospital_id: hospital.id,
          },
        },
      });

    if (existing) continue;

    await prisma.hospital_responses.create({
      data: {
        request_id: requestId,
        hospital_id: hospital.id,
        status: "NO_RESPONSE",
        responded_at: new Date(),
      },
    });
  }
};

/**
 * Fetch accepted hospitals sorted by score
 */
const getAcceptedHospitals = async (requestId) => {
  return await prisma.hospital_responses.findMany({
    where: {
      request_id: requestId,
      status: "ACCEPTED",
    },

    include: {
      hospitals: {
        include: {
          hospital_profiles: true,
          hospital_resources: true,
          hospital_doctors: true,
          hospital_departments: true,
          hospital_equipment: true,
        },
      },
    },

    orderBy: {
      score: "desc",
    },
  });
};

module.exports = {
  saveHospitalResponse,
  markNoResponseHospitals,
  getAcceptedHospitals,
};