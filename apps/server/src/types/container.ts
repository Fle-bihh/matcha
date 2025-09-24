export enum ETokens {
	BaseRepository = "BaseRepository",
	HelloRepository = "HelloRepository",
	HelloService = "HelloService",
}

export interface IContainer {
	get<T>(token: ETokens): T;
}
