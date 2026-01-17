import { z } from "zod";
import { AuthUser, User } from "../models";

export const CreateVisitDtoSchema = z.object({
	visited_id: z.coerce
		.number()
		.int()
		.positive("User ID must be a positive integer"),
});

export type CreateVisitDto = z.infer<typeof CreateVisitDtoSchema>;

export interface VisitWithUser {
	id: number;
	visitor_id: number;
	visited_id: number;
	created_at: string;
	visitor: User;
}
