import { z } from "zod";

import {
	commonValidations,
	createEntitySchema,
	createCreateEntitySchema,
	createUpdateEntitySchema,
} from "../validation";

const baseUserFields = {
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username too long"),
	email: z.string().and(z.email("Invalid email address")),
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
	...baseUserFields,
	...passwordField,
};

export const UserSchema = createEntitySchema(baseUserFields);
export const CreateUserSchema = createCreateEntitySchema(
	userFieldsWithPassword
);
export const UpdateUserSchema = createUpdateEntitySchema(baseUserFields);

export const UserWithPasswordSchema = createEntitySchema(
	userFieldsWithPassword
);

export type User = z.infer<typeof UserSchema>;
export type UserWithPassword = z.infer<typeof UserWithPasswordSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const GetUserSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});
