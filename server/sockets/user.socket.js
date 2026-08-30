// const { v4: uuidv4 } = require("uuid");
const { getNearbyHospitalsFromDatabase } = require("../services/matching/databaseHospitalSearch");
const {
    markNoResponseHospitals,
} = require("../services/dispatch/response.service");

module.exports = function registerUserSocket(io, state) {

    io.on("connection", (socket) => {

        console.log("+ Client", socket.id);

        socket.on("sos_trigger", async ({ emergencyId, lat, lng, range }) => {

            const uLat = parseFloat(lat);
            const uLng = parseFloat(lng);
            const maxKm = parseFloat(range) || 10;

            if (isNaN(uLat) || isNaN(uLng)) {
                return socket.emit("error", {
                    message: "Invalid location."
                });
            }

            const sessionId = emergencyId ;

            let nearby = [];

            try {

                nearby = await getNearbyHospitalsFromDatabase(
                    uLat,
                    uLng,
                    maxKm
                );

            } catch (err) {

                console.error(err);

                return socket.emit("error", {
                    message: "Unable to search hospitals."
                });

            }

            state.activeSessions[sessionId] = {

                sessionId,

                requestId: emergencyId,

                userSocketId: socket.id,

                lat: uLat,

                lng: uLng,

                range: maxKm,

                startedAt: Date.now(),

                expiresAt: Date.now() + 30000,

                closed: false,

                nearbyHospitals: nearby,

                acceptedHospitals: new Map()

            };

            socket.join(`session:${sessionId}`);

            socket.emit("session_created", {
                sessionId
            });

            socket.emit("search_started", {

                sessionId,

                hospitals: nearby

            });

            // Send request to every online hospital

            nearby.forEach((hospital) => {

                const hospitalSocket =
                    state.hospitalSockets[hospital.id];

                if (!hospitalSocket) return;

                io.to(hospitalSocket).emit(
                    "new_emergency",
                    {

                        sessionId,

                        hospital,

                        userLocation: {

                            lat: uLat,

                            lng: uLng

                        }

                    }
                );

                console.log(
                    "Emergency sent ->",
                    hospital.hospitalName || hospital.name
                );

            });

            // Close after 30 seconds

            setTimeout(async () => {

                const session =
                    state.activeSessions[sessionId];

                if (!session || session.closed) return;

                session.closed = true;

                // Save NO_RESPONSE for remaining hospitals

                await markNoResponseHospitals(
                    session.requestId,
                    session.nearbyHospitals
                );

                // remove request from all hospitals

                session.nearbyHospitals.forEach((hospital) => {

                    const hospitalSocket =
                        state.hospitalSockets[hospital.id];

                    if (hospitalSocket) {

                        io.to(hospitalSocket).emit(
                            "emergency_closed",
                            {

                                sessionId

                            }
                        );

                    }

                });

                socket.emit("search_completed", {

                    sessionId

                });

                console.log(
                    "Emergency Window Closed:",
                    sessionId
                );

            }, 30000);

        });

        socket.on(
            "check_bed",
            ({ sessionId, hospitalId, bedType }) => {

                const session =
                    state.activeSessions[sessionId];

                if (!session) {

                    return socket.emit(
                        "bed_response",
                        {

                            hospitalId,

                            bedType,

                            available: false,

                            count: 0

                        }
                    );

                }

                const hospital =
                    session.nearbyHospitals.find(
                        (h) => h.id === hospitalId
                    );

                if (!hospital) {

                    return socket.emit(
                        "bed_response",
                        {

                            hospitalId,

                            bedType,

                            available: false,

                            count: 0

                        }
                    );

                }

                socket.emit("bed_response", {

                    hospitalId,

                    bedType,

                    available:
                        (hospital.beds[bedType] || 0) > 0,

                    count:
                        hospital.beds[bedType] || 0,

                    hospitalName:
                        hospital.hospitalName || hospital.name

                });

            }
        );

        socket.on("sos_cancel", ({ sessionId }) => {

            delete state.activeSessions[sessionId];

        });

        socket.on("disconnect", () => {

            console.log("- Client", socket.id);

        });

    });

};