import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(11, "Phone number must be 11 digits")
      .max(11, "Phone number must be 11 digits")
      .regex(/^0[789][01]\d{8}$/, "Please enter a valid Nigerian mobile phone number (e.g. 08012345678)"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const billPurchaseSchema = z.object({
  serviceType: z.enum(["AIRTIME", "DATA", "CABLE", "ELECTRICITY", "EPIN"]),
  provider: z.string().min(1, "Provider is required"),
  amount: z.number().positive("Amount must be greater than zero").optional(),
  phoneNumber: z.string().optional(),
  recipient: z.string().optional(),
  planId: z.string().optional(),
  meterType: z.enum(["PREPAID", "POSTPAID"]).optional(),
  quantity: z.number().int().min(1).max(20).optional(),
  pin: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type BillPurchaseFormData = z.infer<typeof billPurchaseSchema>;
