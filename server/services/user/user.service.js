const bcrypt = require("bcrypt");
const prisma = require("../../config/db");
const { generateToken } = require("../../utils/jwt");
const { Prisma } = require("@prisma/client");
const {
  userRegisterSchema,
  userLoginSchema,
  emergencyRequestSchema,
} = require("../../validators/user.validation");
const registeruser = async (body) => {

    const data = userRegisterSchema.parse(body);

    if (data.email) {

        const emailExists = await prisma.users.findUnique({
            where:{
                email:data.email,
            },
        });

        if(emailExists){
            throw new Error("Email already registered.");
        }
    }

    const phoneExists = await prisma.users.findUnique({
        where:{
            phone:data.phone,
        },
    });

    if(phoneExists){
        throw new Error("Phone already registered.");
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        10
    );

    const user = await prisma.users.create({
        data:{
            full_name:data.fullName,

            email:data.email || null,

            phone:data.phone,

            password_hash:hashedPassword,
        },
    });

    const token = generateToken({
        userId:user.id,
        role:"user",
    });

    return{

        success:true,

        message:"user registered successfully.",

        token,

        user:{
            id:user.id,
            fullName:user.full_name,
            email:user.email,
            phone:user.phone,
        }

    };

};

const loginuser = async (body) => {

  const data = userLoginSchema.parse(body);

  const user = await prisma.users.findFirst({
    where: {
      OR: [
        { email: data.email || undefined },
        { phone: data.phone || undefined },
      ],
    },
  });

  if (!user) {
    throw new Error("Invalid email/phone or password.");
  }

  const validPassword = await bcrypt.compare(
    data.password,
    user.password_hash
  );

  if (!validPassword) {
    throw new Error("Invalid email/phone or password.");
  }

  const token = generateToken({
    userId: user.id,
    role: "user",
  });

  return {
    success: true,
    message: "user logged in successfully.",

    token,

    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
    },
  };
};

const createEmergencyRequest = async (userId, body) => {

    const data = emergencyRequestSchema.parse(body);

    const emergency = await prisma.emergency_requests.create({
        data: {
            user_id: userId,

            description: data.description,

            latitude: new Prisma.Decimal(data.latitude),

            longitude: new Prisma.Decimal(data.longitude),

            search_radius_km: data.searchRadiusKm,

            status: "SEARCHING",
        },
    });

    for (const item of data.requirements) {

        await prisma.emergency_requirements.create({

            data: {

                request_id: emergency.id,

                requirement_name: item,

            },

        });

    }

    return {

        success: true,

        message: "Emergency request created.",

        emergency,

    };

};


module.exports={
    registeruser,
    loginuser,
    createEmergencyRequest,
};
