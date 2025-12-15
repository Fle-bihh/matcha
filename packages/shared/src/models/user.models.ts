import { z } from "zod";

import { createEntitySchema, createCreateEntitySchema } from "../dto";

const baseUserFields = {
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username too long"),
};

const authUserFields = {
	email: z.string().and(z.email("Invalid email address")),
	first_name: z
		.string()
		.min(1, "First name must be at least 1 character")
		.max(30, "First name too long"),
	last_name: z
		.string()
		.min(1, "Last name must be at least 1 character")
		.max(30, "Last name too long"),
	...baseUserFields,
};

const passwordField = {
	password: z
		.string()
		.min(7, "Password must be at least 7 characters")
		.max(30, "Password must not exceed 30 characters")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(
			/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
			"Password must contain at least one special character"
		)
		.refine((password) => {
			return true;
		}, "Password validation error"),
};

const userFieldsWithPassword = {
	...authUserFields,
	...passwordField,
};

export const UserSchema = createEntitySchema(baseUserFields);
export const AuthUserSchema = createEntitySchema(authUserFields);
export const CreateUserSchema = createCreateEntitySchema(
	userFieldsWithPassword
);

export const UserWithPasswordSchema = createEntitySchema(
	userFieldsWithPassword
);

export type User = z.infer<typeof UserSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type UserWithPassword = z.infer<typeof UserWithPasswordSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
