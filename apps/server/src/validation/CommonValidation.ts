import { z } from "zod";

export const commonValidations = {
	id: z.number().int().positive("ID must be a positive integer"),
	metadata_date: z.date().or(z.string().datetime()),
	metadata_data_optional: z
		.date()
		.or(z.string().datetime())
		.nullable()
		.optional(),
};

export const baseEntityMetadata = {
	id: commonValidations.id,

	created_at: commonValidations.metadata_date,
	updated_at: commonValidations.metadata_date,
	deleted_at: commonValidations.metadata_data_optional,
};

export const BaseEntitySchema = z.object(baseEntityMetadata);

export const BaseCreateEntitySchema = z.object({});

export const BaseUpdateEntitySchema = z.object({
	id: baseEntityMetadata.id,
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type BaseCreateEntity = z.infer<typeof BaseCreateEntitySchema>;
export type BaseUpdateEntity = z.infer<typeof BaseUpdateEntitySchema>;

export interface DocumentWithMetadata {
	id: number;
	created_at: Date | string;
	updated_at: Date | string;
	deleted_at?: Date | string | null;
}

export function createEntitySchema<T extends z.ZodRawShape>(fields: T) {
	return BaseEntitySchema.extend(fields);
}

export function createCreateEntitySchema<T extends z.ZodRawShape>(fields: T) {
	return BaseCreateEntitySchema.extend(fields);
}

export function createUpdateEntitySchema<T extends z.ZodRawShape>(fields: T) {
	return BaseUpdateEntitySchema.extend(fields)
		.partial()
		.required({ id: true });
}
