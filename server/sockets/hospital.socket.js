const {
  saveHospitalResponse,
} = require("../services/dispatch/response.service");

module.exports = function registerHospitalSocket(io, state) {

  io.on("connection", (socket) => {

    console.log("🏥 Hospital Connected:", socket.id);

    // ==========================
    // Hospital Login
    // ==========================

    socket.on("hospital_join", ({ hospitalId }) => {

      if (!hospitalId) return;

      state.hospitalSockets[hospitalId] = socket.id;

      socket.join(`hospital:${hospitalId}`);

      console.log(`Hospital Joined: ${hospitalId}`);

      socket.emit("joined", {
        success: true,
        hospitalId,
      });

    });

    // ==========================
    // ACCEPT REQUEST
    // ==========================

    socket.on("accept_request", async ({ sessionId, hospital }) => {

      try {

        const session = state.activeSessions[sessionId];

        if (!session) {
          socket.emit("request_not_found");
          return;
        }

        // 30 second window closed

        if (session.closed) {
          socket.emit("window_closed");
          return;
        }

        // Prevent duplicate accept

        if (session.acceptedHospitals.has(hospital.id)) {
          return;
        }

        // Save in memory

        session.acceptedHospitals.set(hospital.id, hospital);

        // Save in Database

        await saveHospitalResponse({

          requestId: session.requestId,

          hospitalId: hospital.id,

          status: "ACCEPTED",

          score: hospital.score ?? 0,

          responseTimeMs:
            Date.now() - session.startedAt,

        });

        // Immediately notify user

        io.to(session.userSocketId).emit(
          "hospital_response",
          {
            ...hospital,
            accepted: true,
            sessionId,
          }
        );

        console.log(
          `✅ ${hospital.hospitalName || hospital.name} accepted`
        );

      } catch (err) {

        console.error(err);

      }

    });

    // ==========================
    // REJECT REQUEST
    // ==========================

    socket.on("reject_request", async ({ sessionId, hospitalId }) => {

      try {

        const session = state.activeSessions[sessionId];

        if (!session) return;

        if (session.closed) {
          socket.emit("window_closed");
          return;
        }

        await saveHospitalResponse({

          requestId: session.requestId,

          hospitalId,

          status: "REJECTED",

          responseTimeMs:
            Date.now() - session.startedAt,

        });

        console.log(`❌ Hospital ${hospitalId} rejected`);

      } catch (err) {

        console.error(err);

      }

    });

    // ==========================
    // Disconnect
    // ==========================

    socket.on("disconnect", () => {

      console.log("🏥 Hospital Disconnected:", socket.id);

      for (const hospitalId in state.hospitalSockets) {

        if (state.hospitalSockets[hospitalId] === socket.id) {

          delete state.hospitalSockets[hospitalId];

          break;

        }

      }

    });

  });

};