import { z } from "zod";
import { Match } from "../models";

export const CreateLikeDtoSchema = z.object({
	liked_id: z.coerce
		.number()
		.int()
		.positive("User ID must be a positive integer"),
});

export type CreateLikeDto = z.infer<typeof CreateLikeDtoSchema>;

export const UnlikeUserDtoSchema = z.object({
	id: z.coerce.number().int().positive("User ID must be a positive integer"),
});

export type UnlikeUserDto = z.infer<typeof UnlikeUserDtoSchema>;

export interface CreateLikeResponseDto {}
