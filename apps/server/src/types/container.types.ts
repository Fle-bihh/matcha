export enum ETokens {
	BaseRepository = "BaseRepository",
	HelloRepository = "HelloRepository",
	HelloService = "HelloService",
	UserRepository = "UserRepository",
	UserService = "UserService",
	AuthService = "AuthService",
}

export interface IContainer {
	get<T>(token: ETokens): T;
}
