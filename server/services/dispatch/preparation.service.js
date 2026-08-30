const prisma = require("../../config/db");

async function getPreparationData(emergencyId) {

    return await prisma.emergency_requests.findUnique({

        where: {
            id: emergencyId
        },

        include: {

            users: {

                select: {

                    id: true,

                    full_name: true,

                    phone: true,

                    blood_group: true,

                    allergies: true,

                    medical_conditions: true,

                    emergency_contact_name: true,

                    emergency_contact_phone: true

                }

            }

        }

    });

}

module.exports = {
    getPreparationData
};