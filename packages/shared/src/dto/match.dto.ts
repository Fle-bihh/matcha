import { z } from "zod";

export const MatchesFiltersDtoSchema = z.object({
	unread_only: z.boolean().optional(),
});

export type MatchesFilterDto = z.infer<typeof MatchesFiltersDtoSchema>;

export interface GetMatchesResponseDto {
	unread_conversations_count: number;
}

export interface DeleteMatchSocketDto {
	match_id: number;
	message?: string;
	unlike_id?: number;
}
