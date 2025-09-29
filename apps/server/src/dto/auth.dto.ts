import { CreateUserSchema, User } from "@matcha/shared";
import { z } from "zod";

export const RegisterRequestSchema = CreateUserSchema.refine(
	(data) => {
		const emailPrefix = data.email.split("@")[0].toLowerCase();
		const password = data.password.toLowerCase();

		if (
			emailPrefix.length >= 3 &&
			(password.includes(emailPrefix) || emailPrefix.includes(password))
		) {
			return false;
		}

		return true;
	},
	{
		message: "Password cannot be too similar to your email address",
		path: ["password"],
	}
);

export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
	email: z.string().and(z.email("Invalid email address")),
	password: z.string().min(1, "Password is required"),
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

export interface RegisterResponseDto {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export interface LoginResponseDto {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export const RefreshTokenRequestSchema = z.object({
	refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenRequestDto = z.infer<typeof RefreshTokenRequestSchema>;

export interface RefreshTokenResponseDto {
	accessToken: string;
	refreshToken: string;
}
