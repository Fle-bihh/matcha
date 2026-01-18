import { z } from "zod";

export const CreateReportDtoSchema = z.object({
	reported_id: z.coerce
		.number()
		.int()
		.positive("User ID must be a positive integer"),
	reason: z.string().optional(),
});

export type CreateReportDto = z.infer<typeof CreateReportDtoSchema>;

export interface CreateReportResponseDto {}
