import { z } from "zod";

import {
	commonValidations,
	createEntitySchema,
	createCreateEntitySchema,
	createUpdateEntitySchema,
} from "../validation";

const userFields = {
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username too long"),
};

export const UserSchema = createEntitySchema(userFields);
export const CreateUserSchema = createCreateEntitySchema(userFields);
export const UpdateUserSchema = createUpdateEntitySchema(userFields);

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const GetUserSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});
