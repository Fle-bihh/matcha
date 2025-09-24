const API_DOCS_STORAGE = new Map<string, string>();

export function ApiDocs(description: string) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		const key = `${target.constructor.name}.${propertyKey}`;
		API_DOCS_STORAGE.set(key, description);

		return descriptor;
	};
}

export function getApiDocs(
	target: any,
	methodName: string
): string | undefined {
	const key = `${target.constructor.name}.${methodName}`;
	return API_DOCS_STORAGE.get(key);
}

export function getAllApiDocs(): Map<string, string> {
	return new Map(API_DOCS_STORAGE);
}
