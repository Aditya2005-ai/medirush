const { Prisma } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = require("../../config/db");
const { generateToken } = require("../../utils/jwt");
const {
    hospitalRegisterSchema,
    hospitalLoginSchema,
    hospitalProfileSchema,
    hospitalResourceSchema,
    departmentSchema,
    doctorSchema,
    equipmentSchema,
} = require("../../validators/hospital.validation");

const registerHospital = async (body) => {
  // Validate Request
  const data = hospitalRegisterSchema.parse(body);

  // Check Email
  const existingEmail = await prisma.hospitals.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingEmail) {
    throw new Error("Email already registered.");
  }

  // Check Phone
  const existingPhone = await prisma.hospitals.findUnique({
    where: {
      phone: data.phone,
    },
  });

  if (existingPhone) {
    throw new Error("Phone number already registered.");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Debug Logs
  console.log("========== REGISTER REQUEST ==========");
  console.log(data);

  const createData = {
    hospital_name: data.hospitalName,
    email: data.email,
    phone: data.phone,
    password_hash: hashedPassword,
    profile_completed: false,
    is_verified: false,
  };

  console.log("Create Data:");
  console.log(createData);

  // Create Hospital
  const hospital = await prisma.hospitals.create({
    data: createData,
  });

  console.log("Hospital Created:");
  console.log(hospital);

  // Generate JWT
  const token = generateToken({
    hospitalId: hospital.id,
    role: "hospital",
  });

  return {
    success: true,
    message: "Hospital registered successfully.",
    token,
    hospital: {
      id: hospital.id,
      hospitalName: hospital.hospital_name,
      email: hospital.email,
      phone: hospital.phone,
      profileCompleted: hospital.profile_completed,
      verified: hospital.is_verified,
    },
  };
};
const hospitalLogin = async (body) => {

  const data = hospitalLoginSchema.parse(body);

  const hospital = await prisma.hospitals.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!hospital) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordCorrect = await bcrypt.compare(
    data.password,
    hospital.password_hash
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken({
    hospitalId: hospital.id,
    role: "hospital",
  });

  return {
    success: true,
    message: "Login successful.",

    token,

    hospital: {
      id: hospital.id,
      hospitalName: hospital.hospital_name,
      email: hospital.email,
      phone: hospital.phone,
      profileCompleted: hospital.profile_completed,
      verified: hospital.is_verified,
    },
  };
};

  // Check profile exists
const updateHospitalProfile = async (hospitalId, body) => {
  const data = hospitalProfileSchema.parse(body);

  // Update hospitals table
  await prisma.hospitals.update({
    where: {
      id: hospitalId,
    },
    data: {
      registration_number: data.registrationNumber,
      hospital_type: data.hospitalType,
      profile_completed: true,
    },
  });

  const profileData = {
    address: data.address,
    city: data.city,
    state: data.state,
    country: "India",
    pincode: data.pincode,
    latitude: new Prisma.Decimal(data.latitude),
    longitude: new Prisma.Decimal(data.longitude),
    emergency_contact: data.emergencyContact || null,
    website: data.website || null,
    license_number: data.licenseNumber || null,
  };

  const existingProfile = await prisma.hospital_profiles.findUnique({
    where: {
      hospital_id: hospitalId,
    },
  });

  if (existingProfile) {
    await prisma.hospital_profiles.update({
      where: {
        hospital_id: hospitalId,
      },
      data: profileData,
    });
  } else {
    await prisma.hospital_profiles.create({
      data: {
        hospital_id: hospitalId,
        ...profileData,
      },
    });
  }

  return {
    success: true,
    message: "Hospital profile updated successfully.",
  };
};

/* =======================================================
   GET HOSPITAL RESOURCES
======================================================= */

const getHospitalResources = async (hospitalId) => {
  return await prisma.hospital_resources.findUnique({
    where: {
      hospital_id: hospitalId,
    },
  });
};

/* =======================================================
   UPDATE HOSPITAL RESOURCES
======================================================= */

const updateHospitalResources = async (hospitalId, body) => {
  const data = hospitalResourceSchema.parse(body);

  const resourceData = {
    total_beds: data.totalBeds,
    available_beds: data.availableBeds,

    total_icu_beds: data.totalIcuBeds,
    available_icu_beds: data.availableIcuBeds,

    total_emergency_beds: data.totalEmergencyBeds,
    available_emergency_beds: data.availableEmergencyBeds,

    total_ventilators: data.totalVentilators,
    available_ventilators: data.availableVentilators,

    total_operation_theatres: data.totalOperationTheatres,
    available_operation_theatres: data.availableOperationTheatres,

    total_ambulances: data.totalAmbulances,
    available_ambulances: data.availableAmbulances,

    blood_bank_available: data.bloodBankAvailable,
  };

  const existing = await prisma.hospital_resources.findUnique({
    where: {
      hospital_id: hospitalId,
    },
  });

  if (existing) {
    await prisma.hospital_resources.update({
      where: {
        hospital_id: hospitalId,
      },
      data: resourceData,
    });
  } else {
    await prisma.hospital_resources.create({
      data: {
        hospital_id: hospitalId,
        ...resourceData,
      },
    });
  }

  return {
    success: true,
    message: "Hospital resources updated successfully.",
  };
};

const createDepartment = async (hospitalId, body) => {

    const data = departmentSchema.parse(body);

    const existing = await prisma.hospital_departments.findFirst({

        where:{

            hospital_id:hospitalId,

            department_name:data.departmentName

        }

    });

    if(existing){

        throw new Error("Department already exists");

    }

    const department = await prisma.hospital_departments.create({

        data:{

            hospital_id:hospitalId,

            department_name:data.departmentName

        }

    });

    return department;

};

const getDepartments = async(hospitalId)=>{

    return await prisma.hospital_departments.findMany({

        where:{

            hospital_id:hospitalId

        },

        orderBy:{

            department_name:"asc"

        }

    });

};

const deleteDepartment = async(hospitalId,id)=>{

    await prisma.hospital_departments.delete({

        where:{

            id

        }

    });

    return{

        success:true,

        message:"Department deleted"

    };

};

/* ======================================================
   CREATE DOCTOR
====================================================== */

const createDoctor = async (hospitalId, body) => {

  const data = doctorSchema.parse(body);

  return await prisma.hospital_doctors.create({

    data: {

      hospital_id: hospitalId,

      specialization: data.specialization,

      total_doctors: data.totalDoctors,

      available_doctors: data.availableDoctors,

      on_duty_doctors: data.onDutyDoctors,

    },

  });

};


/* ======================================================
   GET DOCTORS
====================================================== */

const getDoctors = async (hospitalId) => {

  return await prisma.hospital_doctors.findMany({

    where: {

      hospital_id: hospitalId,

    },

    orderBy: {

      specialization: "asc",

    },

  });

};

/* ======================================================
   CREATE EQUIPMENT
====================================================== */

const createEquipment = async (hospitalId, body) => {

  const data = equipmentSchema.parse(body);

  return await prisma.hospital_equipment.create({
    data: {
      hospital_id: hospitalId,
      equipment_name: data.equipmentName,
      total_quantity: data.totalQuantity,
      available_quantity: data.availableQuantity,
      is_operational: data.isOperational,
    },
  });

};


/* ======================================================
   GET EQUIPMENT
====================================================== */

const getEquipment = async (hospitalId) => {

  return await prisma.hospital_equipment.findMany({
    where: {
      hospital_id: hospitalId,
    },
    orderBy: {
      equipment_name: "asc",
    },
  });

};

module.exports = {
    registerHospital,
    hospitalLogin,
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