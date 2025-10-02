import { z } from "zod";

export const GetHealthRequestSchema = z.object({
	include_details: z.coerce.boolean().optional(),
});

export type GetHealthRequestDto = z.infer<typeof GetHealthRequestSchema>;

export interface GetHealthResponseDto {
	status: string;
	timestamp: string;
	service: string;
	uptime?: number;
	details?: {
		memory_usage?: NodeJS.MemoryUsage;
		cpu_usage?: number;
	};
}
