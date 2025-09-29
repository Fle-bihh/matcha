export enum ETokens {
	BaseRepository = "BaseRepository",
	HealthService = "HealthService",
	UserRepository = "UserRepository",
	UserService = "UserService",
	AuthService = "AuthService",
}

export interface IContainer {
	get<T>(token: ETokens): T;
}
