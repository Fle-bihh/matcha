export function sanitizeString(value: string): string {
	return value
		.trim()
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

export function sanitizeEntity<T extends Record<string, any>>(entity: T): T {
	const sanitized = { ...entity };

	for (const key in sanitized) {
		if (typeof sanitized[key] === "string") {
			(sanitized as any)[key] = sanitizeString(sanitized[key]);
		}
	}

	return sanitized;
}

export function sanitizeEntities<T extends Record<string, any>>(
	entities: T[]
): T[] {
	return entities.map((entity) => sanitizeEntity(entity));
}
