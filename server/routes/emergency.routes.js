const express = require("express");

const router = express.Router();

const {
  testHospitalSearch,
} = require("../controllers/emergency.controller");

router.post("/search", testHospitalSearch);

module.exports = router;