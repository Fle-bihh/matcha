export function parseErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

export function serializeError(error: unknown): {
	message: string;
	code?: number | undefined;
	timestamp: string;
} {
	if (error instanceof Error) {
		const serializedError = {
			message: error.message,
			timestamp: new Date().toISOString(),
		};
		return serializedError;
	}
	return {
		message: String(error),
		timestamp: new Date().toISOString(),
	};
}
