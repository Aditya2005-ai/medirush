const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const userAuthMiddleware = async (req, res, next) => {
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

    if (decoded.role !== "user") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await prisma.users.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = userAuthMiddleware;