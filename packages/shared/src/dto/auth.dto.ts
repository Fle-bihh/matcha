import { z } from "zod";
import { AuthUser } from "../models";
import {
  fields,
  validatePasswordSimilarity,
  validateUsernameUniqueness,
} from "../validation";
import { CreateUserDtoSchema } from "./user.dto";

export const RegisterRequestSchema = CreateUserDtoSchema.superRefine(
  (data, ctx) => {
    validatePasswordSimilarity(data.email, data.password, ctx);
    validateUsernameUniqueness(data.username, data.email, ctx);
  }
);

export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

export interface AuthenticateResponseDto {
  user: AuthUser;
}

export const LoginRequestSchema = z.object({
  username: fields.username,
  password: fields.passwordLogin, // Less strict for login
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

export interface RegisterResponseDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginResponseDto extends RegisterResponseDto {}

export const RefreshTokenRequestSchema = z.object({
  refreshToken: fields.refreshToken,
});

export type RefreshTokenRequestDto = z.infer<typeof RefreshTokenRequestSchema>;

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}
