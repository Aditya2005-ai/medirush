const express = require("express");
const cors = require("cors");

const hospitalRoutes = require("./routes/hospital.routes");

const errorMiddleware = require("./middleware/error.middleware");

const userRoutes = require("./routes/user.routes");

const emergencyRoutes = require("./routes/emergency.routes");

const dispatchRoutes = require("./routes/dispatch.routes");

module.exports = function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/hospitals", hospitalRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/emergencies", emergencyRoutes);
  app.use(errorMiddleware);
  app.use("/api/dispatch", dispatchRoutes);

  return app;
};