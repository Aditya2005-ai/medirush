const { z } = require("zod");

const hospitalRegisterSchema = z.object({
  hospitalName: z
    .string()
    .min(3, "Hospital name must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});


const hospitalLoginSchema = z.object({
  email: z.string().email().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

const hospitalProfileSchema = z.object({
  registrationNumber: z.string().min(3),

  hospitalType: z.enum([
    "MULTI_SPECIALITY",
    "GENERAL",
    "CARDIAC",
    "TRAUMA",
    "CHILDREN",
    "CANCER",
    "ORTHOPEDIC",
  ]),

  address: z.string().min(5),

  city: z.string().min(2),

  state: z.string().min(2),

  pincode: z.string().regex(/^\d{6}$/),

  latitude: z.number(),

  longitude: z.number(),
});

const hospitalResourceSchema = z.object({
  totalBeds: z.number().int().min(0),
  availableBeds: z.number().int().min(0),

  totalIcuBeds: z.number().int().min(0),
  availableIcuBeds: z.number().int().min(0),

  totalEmergencyBeds: z.number().int().min(0),
  availableEmergencyBeds: z.number().int().min(0),

  totalVentilators: z.number().int().min(0),
  availableVentilators: z.number().int().min(0),

  totalOperationTheatres: z.number().int().min(0),
  availableOperationTheatres: z.number().int().min(0),

  totalAmbulances: z.number().int().min(0),
  availableAmbulances: z.number().int().min(0),

  bloodBankAvailable: z.boolean()
});

const departmentSchema = z.object({
  departmentName: z
    .string()
    .min(2, "Department name is required"),
});

const doctorSchema = z.object({
  specialization: z
    .string()
    .min(2, "Specialization is required"),

  totalDoctors: z
    .number()
    .int()
    .min(0),

  availableDoctors: z
    .number()
    .int()
    .min(0),

  onDutyDoctors: z
    .number()
    .int()
    .min(0),
});

const equipmentSchema = z.object({
  equipmentName: z
    .string()
    .min(2, "Equipment name is required"),

  totalQuantity: z
    .number()
    .int()
    .min(0),

  availableQuantity: z
    .number()
    .int()
    .min(0),

  isOperational: z.boolean(),
});

module.exports = {
  hospitalRegisterSchema,
  hospitalLoginSchema,
  hospitalProfileSchema,
  hospitalResourceSchema,
  departmentSchema,
  doctorSchema,
  equipmentSchema,
};
