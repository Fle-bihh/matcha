import { z } from "zod";

export const MatchesFiltersDtoSchema = z.object({});

export type MatchesFilterDto = z.infer<typeof MatchesFiltersDtoSchema>;

export interface GetMatchesResponseDto {}

export interface DeleteMatchSocketDto {
	match_id: number;
	message?: string;
	unlike_id?: number;
}
