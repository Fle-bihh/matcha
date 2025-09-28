function isDate(value: unknown): value is Date {
	return value instanceof Date;
}

export function sanitizeString(value: string): string {
	return value
		.trim()
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

export function sanitizeDate(value: Date): string {
	return new Date(value).toISOString();
}

export function sanitizeEntity<T extends Record<string, any>>(entity: T): T {
	const sanitized = { ...entity };

	for (const key in sanitized) {
		const value = sanitized[key];
		if (typeof value === "string") {
			(sanitized as any)[key] = sanitizeString(value);
		}
		if (isDate(value)) {
			(sanitized as any)[key] = sanitizeDate(value);
		}
	}

	return sanitized;
}

export function sanitizeEntities<T extends Record<string, any>>(
	entities: T[]
): T[] {
	return entities.map((entity) => sanitizeEntity(entity));
}
