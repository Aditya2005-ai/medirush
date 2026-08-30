const prisma = require("../../config/db");

/**
 * user selects a hospital
 */
const selectHospital = async ({ emergencyId, hospitalId }) => {

    // Check emergency exists
    const emergency = await prisma.emergency_requests.findUnique({
        where: {
            id: emergencyId,
        },
    });

    if (!emergency) {
        throw new Error("Emergency request not found.");
    }

    // Check hospital exists
    const hospital = await prisma.hospitals.findUnique({
        where: {
            id: hospitalId,
        },
    });

    if (!hospital) {
        throw new Error("Hospital not found.");
    }

    // Update emergency
    const updatedEmergency =
        await prisma.emergency_requests.update({

            where: {
                id: emergencyId,
            },

            data: {
                selected_hospital_id: hospitalId,
                status: "HOSPITAL_SELECTED",
                updated_at: new Date(),
            },

            include: {
                hospitals: true,
            },

        });

    return updatedEmergency;
};

module.exports = {
    selectHospital,
};