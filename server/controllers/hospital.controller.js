const hospitalService = require("../services/hospital/hospital.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/* =======================================================
   REGISTER HOSPITAL
======================================================= */

const registerHospital = asyncHandler(async (req, res) => {
  const result = await hospitalService.registerHospital(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      result,
      "Hospital registered successfully"
    )
  );
});

/* =======================================================
   LOGIN HOSPITAL
======================================================= */

const loginHospital = asyncHandler(async (req, res) => {
  const result = await hospitalService.hospitalLogin(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Hospital logged in successfully"
    )
  );
});

/* =======================================================
   CURRENT HOSPITAL
======================================================= */

const getCurrentHospital = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      req.hospital,
      "Hospital profile fetched successfully"
    )
  );
});

/* =======================================================
   UPDATE PROFILE
======================================================= */

const updateHospitalProfile = asyncHandler(async (req, res) => {
  const result = await hospitalService.updateHospitalProfile(
    req.hospital.id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Hospital profile updated successfully"
    )
  );
});

/* =======================================================
   GET RESOURCES
======================================================= */

const getHospitalResources = asyncHandler(async (req, res) => {
  const result = await hospitalService.getHospitalResources(
    req.hospital.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Hospital resources fetched successfully"
    )
  );
});

/* =======================================================
   UPDATE RESOURCES
======================================================= */

const updateHospitalResources = asyncHandler(async (req, res) => {
  const result = await hospitalService.updateHospitalResources(
    req.hospital.id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Hospital resources updated successfully"
    )
  );
});

const createDepartment = asyncHandler(async(req,res)=>{

    const result=await hospitalService.createDepartment(

        req.hospital.id,

        req.body

    );

    res.status(201).json(

        new ApiResponse(

            201,

            result,

            "Department created"

        )

    );

});

const getDepartments = asyncHandler(async(req,res)=>{

    const result=await hospitalService.getDepartments(

        req.hospital.id

    );

    res.json(

        new ApiResponse(

            200,

            result,

            "Departments fetched"

        )

    );

});

const deleteDepartment = asyncHandler(async(req,res)=>{

    const result=await hospitalService.deleteDepartment(

        req.hospital.id,

        req.params.id

    );

    res.json(

        new ApiResponse(

            200,

            result,

            "Department deleted"

        )

    );

});

const createDoctor = asyncHandler(async (req, res) => {

  const result = await hospitalService.createDoctor(

    req.hospital.id,

    req.body

  );

  return res.status(201).json(

    new ApiResponse(

      201,

      result,

      "Doctor specialization created"

    )

  );

});

const getDoctors = asyncHandler(async (req, res) => {

  const result = await hospitalService.getDoctors(

    req.hospital.id

  );

  return res.status(200).json(

    new ApiResponse(

      200,

      result,

      "Doctors fetched"

    )

  );

});


const createEquipment = asyncHandler(async (req, res) => {

  const result = await hospitalService.createEquipment(
    req.hospital.id,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      result,
      "Equipment created"
    )
  );

});

const getEquipment = asyncHandler(async (req, res) => {

  const result = await hospitalService.getEquipment(
    req.hospital.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Equipment fetched"
    )
  );

});
/* =======================================================
   EXPORTS
======================================================= */

module.exports = {
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
};