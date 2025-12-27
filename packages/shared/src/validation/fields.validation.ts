import { z } from "zod";
import { MAX_USER_INTERESTS } from "../constants";

export const fields = {
  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(7, "Password must be at least 7 characters")
    .max(30, "Password must not exceed 30 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    ),

  // For login - less strict, just needs to be non-empty
  passwordLogin: z.string().min(1, "Password is required"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username too long"),

  firstName: z
    .string()
    .min(1, "First name must be at least 1 character")
    .max(30, "First name too long"),

  lastName: z
    .string()
    .min(1, "Last name must be at least 1 character")
    .max(30, "Last name too long"),

  accessToken: z.string().min(1, "Access token is required"),

  refreshToken: z.string().min(1, "Refresh token is required"),

  age: z
    .number()
    .int("Age must be a whole number")
    .min(18, "You must be at least 18 years old")
    .max(120, "Age must be realistic"),

  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),

  interests: z
    .array(z.string())
    .max(MAX_USER_INTERESTS, "Too many interests selected")
    .refine((arr) => {
      const uniqueInterests = new Set(arr);
      return uniqueInterests.size === arr.length;
    }, "Interests must be unique")
    .optional(),

  formDataNumber: z
    .string()
    .nonempty("Number is required")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num);
    }, "Must be a valid number"),
};
