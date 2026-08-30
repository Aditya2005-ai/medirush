const { selectHospital} = require("../services/dispatch/selection.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const {
    getPreparationData
} = require("../services/dispatch/preparation.service");



const selectHospitalController = asyncHandler(async (req, res) => {

    const { emergencyId, hospitalId } = req.body;

    if (!emergencyId || !hospitalId) {
        throw new ApiError(
            400,
            "Emergency ID and Hospital ID are required."
        );
    }

    const selectedHospital = await selectHospital({
        emergencyId,
        hospitalId,
    });

    const preparationData = await getPreparationData(emergencyId);

    // ===========================
    // Socket Events
    // ===========================

    const io = req.app.get("io");
    const state = req.app.get("state");

    // Notify selected hospital
    const hospitalSocket =
        state.hospitalSockets[hospitalId];

    if (hospitalSocket) {

        io.to(hospitalSocket).emit(

        "user_selected",

        preparationData

        );

    }

    // Notify user
    const session =
        state.activeSessions[emergencyId];

    if (session) {

        io.to(session.userSocketId).emit(
            "selection_success",
            {
                emergencyId,
                hospitalId
            }
        );

    }

    // Remove request from remaining hospitals
    for (const id in state.hospitalSockets) {

        if (id === hospitalId) continue;

        io.to(state.hospitalSockets[id]).emit(
            "request_cancelled",
            {
                emergencyId
            }
        );

    }

    return res.status(200).json(
        new ApiResponse(
            200,
            selectedHospital,
            "Hospital selected successfully."
        )
    );

});



module.exports = {
    selectHospitalController,
};