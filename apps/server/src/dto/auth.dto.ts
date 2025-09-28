import { CreateUserSchema, TestValue, User } from "@matcha/shared";
import { z } from "zod";

export const RegisterRequestSchema = CreateUserSchema;

export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
	email: z.string().and(z.email("Invalid email address")),
	password: z.string().min(1, "Password is required"),
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

export interface RegisterResponseDto {
	token: string;
	user: User;
}

export interface LoginResponseDto {
	token: string;
	user: User;
}
