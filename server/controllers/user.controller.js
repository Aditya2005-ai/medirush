const userService = require("../services/user/user.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const registeruser = asyncHandler(async (req, res) => {

  const result = await userService.registeruser(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      result,
      "user registered successfully"
    )
  );

});

const loginuser = asyncHandler(async (req, res) => {

  const result = await userService.loginuser(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "user logged in successfully"
    )
  );

});

const getCurrentuser = asyncHandler(async (req, res) => {

  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "user profile fetched successfully"
    )
  );

});

const createEmergencyRequest = asyncHandler(async (req, res) => {

    const result = await userService.createEmergencyRequest(
        req.user.id,
        req.body
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            result,
            "Emergency request created successfully"
        )
    );

});

module.exports = {
    registeruser,
    loginuser,
    getCurrentuser,
    createEmergencyRequest,
};