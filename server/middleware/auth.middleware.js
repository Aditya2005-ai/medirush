const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hospital = await prisma.hospitals.findUnique({
            where: {
                id: decoded.hospitalId,
            },
            select: {
                id: true,
                hospital_name: true,
                email: true,
                phone: true,
                registration_number: true,
                hospital_type: true,
                is_verified: true,
                profile_completed: true,
                created_at: true,
                updated_at: true,
            },
});

    if (!hospital) {
      return res.status(401).json({
        success: false,
        message: "Hospital not found",
      });
    }

    req.hospital = hospital;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;