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
		.min(8, "Password must be at least 8 characters")
		.max(100, "Password too long"),
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
