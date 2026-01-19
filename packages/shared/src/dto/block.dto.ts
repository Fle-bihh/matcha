import { z } from "zod";

export const CreateBlockDtoSchema = z.object({
	blocked_id: z.coerce
		.number()
		.int()
		.positive("User ID must be a positive integer"),
});

export type CreateBlockDto = z.infer<typeof CreateBlockDtoSchema>;

export interface CreateBlockResponseDto {}
