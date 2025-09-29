// Clés de métadonnées pour les décorateurs
export const METADATA_KEYS = {
	ROUTE: Symbol("route"),
	API_DOCS: Symbol("api-docs"),
	AUTH: Symbol("auth"),
	VALIDATE: Symbol("validate"),
} as const;

// Types pour les métadonnées
export interface RouteMetadata {
	method: string;
	path: string;
	group: string;
	key: string;
}

export interface ApiDocsMetadata {
	description: string;
}

export interface AuthMetadata {
	required: boolean;
}

export interface ValidateMetadata {
	schema: any;
	source: "query" | "body" | "params";
}
