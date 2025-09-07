import z from "zod";

export const usernameValidation = z
  .string()
  .min(6, "Username must be atleast 6 characters")
  .max(18, "Username must be no more than 20")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address format" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
