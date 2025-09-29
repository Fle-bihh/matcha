import "reflect-metadata";
import {
	METADATA_KEYS,
	type ApiDocsMetadata,
} from "@/constants/metadata.constants";

export function ApiDocs(description: string) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		const metadata: ApiDocsMetadata = { description };
		Reflect.defineMetadata(
			METADATA_KEYS.API_DOCS,
			metadata,
			target,
			propertyKey
		);
		return descriptor;
	};
}

export function getApiDocs(
	target: any,
	methodName: string
): string | undefined {
	const metadata: ApiDocsMetadata = Reflect.getMetadata(
		METADATA_KEYS.API_DOCS,
		target,
		methodName
	);
	return metadata?.description;
}

export function getAllApiDocs(): Map<string, string> {
	// Cette fonction pourrait être améliorée pour parcourir toutes les classes
	// mais pour maintenir la compatibilité, on peut garder l'ancienne logique
	// ou l'adapter selon vos besoins
	return new Map();
}
