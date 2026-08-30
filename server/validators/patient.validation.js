const { z } = require("zod");

const userRegisterSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email")
    .optional(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

const userLoginSchema = z.object({
  email: z
    .string()
    .email()
    .optional(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional(),

  password: z
    .string()
    .min(8),
}).refine(
  (data) => data.email || data.phone,
  {
    message: "Email or phone is required",
  }
);
const emergencyRequestSchema = z.object({
  description: z.string().min(5),

  latitude: z.number(),

  longitude: z.number(),

  searchRadiusKm: z.number().min(1).max(100),

  requirements: z.array(z.string()).min(1),
});

module.exports = {
    userRegisterSchema,
    userLoginSchema,
    emergencyRequestSchema,
};