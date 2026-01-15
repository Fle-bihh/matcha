import { z } from "zod";
import { BrowsingSortBy, SortOrder } from "../types";

export const BrowsingFiltersDtoSchema = z.object({
	ageMin: z.coerce
		.number()
		.int()
		.min(18, "Minimum age must be at least 18")
		.max(100, "Minimum age must not exceed 100")
		.optional(),
	ageMax: z.coerce
		.number()
		.int()
		.min(18, "Maximum age must be at least 18")
		.max(100, "Maximum age must not exceed 100")
		.optional(),
	distanceMax: z.coerce
		.number()
		.positive("Distance must be positive")
		.optional(),
	fameMin: z.coerce
		.number()
		.min(0, "Minimum fame must be at least 0")
		.optional(),
	fameMax: z.coerce
		.number()
		.min(0, "Maximum fame must be at least 0")
		.optional(),
	interests: z
		.string()
		.transform((str) =>
			str
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0)
		)
		.optional(),
	sortBy: z.enum(BrowsingSortBy).optional(),
	sortOrder: z.enum(SortOrder).optional(),
});

export type BrowsingFiltersDto = z.infer<typeof BrowsingFiltersDtoSchema>;
