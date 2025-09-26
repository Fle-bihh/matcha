export enum EEntityTypes {
	USER = "USER",
}

export const ENTITY_NAMES = {
	[EEntityTypes.USER]: "users",
} as const;

export type EntityName = (typeof ENTITY_NAMES)[EEntityTypes];
