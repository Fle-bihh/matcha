import { z } from "zod";

export const GetHelloRequestSchema = z.object({
	name: z
		.string()
		.min(1)
		.max(50)
		.regex(/^[a-zA-Z\s]+$/)
		.optional(),
	greeting_type: z.enum(["standard", "random", "formal"]).optional(),
});

export const GetHealthRequestSchema = z.object({
	include_details: z.coerce.boolean().optional(),
});

export type GetHelloRequestDto = z.infer<typeof GetHelloRequestSchema>;
export type GetHealthRequestDto = z.infer<typeof GetHealthRequestSchema>;

export interface GetHelloResponseDto {
	message: string;
	greeting_type: string;
	timestamp: string;
}

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
