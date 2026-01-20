import { z } from "zod";
import { Message } from "../models";
import { PaginatedResponse } from "../types";

export const CreateUserMessageDtoSchema = z.object({
	match_id: z.coerce
		.number()
		.int()
		.positive("Match ID must be a positive integer"),
	content: z
		.string()
		.min(1, "Message cannot be empty")
		.max(1000, "Message cannot exceed 1000 characters"),
});

export type CreateUserMessageDto = z.infer<typeof CreateUserMessageDtoSchema>;

export const MatchIdParamsDtoSchema = z.object({
	id: z.coerce.number().int().positive("Match ID must be a positive integer"),
});

export type MatchIdParamsDto = z.infer<typeof MatchIdParamsDtoSchema>;

export interface CreateUserMessageResponseDto {}

export interface GetMessagesResponseDto {
	messages: PaginatedResponse<Message>;
}
