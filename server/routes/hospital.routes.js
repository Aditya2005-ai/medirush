const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  registerHospital,
  loginHospital,
  getCurrentHospital,
  updateHospitalProfile,
  getHospitalResources,
  updateHospitalResources,
  createDepartment,
  getDepartments,
  deleteDepartment,
  createDoctor,
  getDoctors,
  createEquipment,
  getEquipment
} = require("../controllers/hospital.controller");

router.post("/register", registerHospital);
router.post("/login", loginHospital);

// Protected Route
router.get("/me", authMiddleware, getCurrentHospital);

router.put(
  "/profile",
  authMiddleware,
  updateHospitalProfile
);

router.get(
  "/resources",
  authMiddleware,
  getHospitalResources
);

router.put(
  "/resources",
  authMiddleware,
  updateHospitalResources
);

router.post(
    "/departments",
    authMiddleware,
    createDepartment
);

router.get(
    "/departments",
    authMiddleware,
    getDepartments
);

router.delete(
    "/departments/:id",
    authMiddleware,
    deleteDepartment
);

router.post(
  "/doctors",
  authMiddleware,
  createDoctor
);

router.get(
  "/doctors",
  authMiddleware,
  getDoctors
);

router.post(
  "/equipment",
  authMiddleware,
  createEquipment
);

router.get(
  "/equipment",
  authMiddleware,
  getEquipment
);

module.exports = router;