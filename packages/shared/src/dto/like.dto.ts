import { z } from "zod";

export const CreateLikeDtoSchema = z.object({
	liked_id: z.coerce
		.number()
		.int()
		.positive("User ID must be a positive integer"),
});

export type CreateLikeDto = z.infer<typeof CreateLikeDtoSchema>;
