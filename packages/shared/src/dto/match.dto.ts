import { z } from "zod";

export const MatchesFiltersDtoSchema = z.object({
	unread_only: z.boolean().optional(),
});

export type MatchesFilterDto = z.infer<typeof MatchesFiltersDtoSchema>;

export interface GetMatchesResponseDto {
	unread_conversations_count: number;
}
