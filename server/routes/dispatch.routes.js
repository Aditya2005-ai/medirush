const express = require("express");

const router = express.Router();

const userAuthMiddleware = require("../middleware/userAuth.middleware");

const {
    selectHospitalController,
} = require("../controllers/dispatch.controller");

router.post(
    "/select",
    userAuthMiddleware,
    selectHospitalController
);

module.exports = router;