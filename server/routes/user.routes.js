const express = require("express");

const router = express.Router();
const userAuthMiddleware = require("../middleware/userAuth.middleware");

const {
  registeruser,
  loginuser,
  getCurrentuser,
  createEmergencyRequest
} = require("../controllers/user.controller");

router.post("/register", registeruser);
router.post("/login", loginuser);
router.get(
  "/me",
  userAuthMiddleware,
  getCurrentuser
);

router.post(
    "/emergency",
    userAuthMiddleware,
    createEmergencyRequest
);
module.exports = router;