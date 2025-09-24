import { z } from "zod";

import {
	commonValidations,
	createEntitySchema,
	createCreateEntitySchema,
	createUpdateEntitySchema,
} from "../validation";

const testValueFields = {
	name: z.string().min(1, "Name is required").max(255, "Name too long"),
	value: z.string().min(1, "Value is required").max(255, "Value too long"),
};

export const TestValueSchema = createEntitySchema(testValueFields);
export const CreateTestValueSchema = createCreateEntitySchema(testValueFields);
export const UpdateTestValueSchema = createUpdateEntitySchema(testValueFields);

export type TestValue = z.infer<typeof TestValueSchema>;
export type CreateTestValue = z.infer<typeof CreateTestValueSchema>;
export type UpdateTestValue = z.infer<typeof UpdateTestValueSchema>;

export const GetTestValueSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});
