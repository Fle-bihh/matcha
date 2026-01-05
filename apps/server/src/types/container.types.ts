export enum ETokens {
	BaseRepository = "BaseRepository",
	HealthService = "HealthService",
	UserRepository = "UserRepository",
	UserService = "UserService",
	AuthService = "AuthService",
	MailService = "MailService",
	EmailVerificationRepository = "EmailVerificationRepository",
	EmailVerificationService = "EmailVerificationService",
	PasswordResetRepository = "PasswordResetRepository",
	PasswordResetService = "PasswordResetService",
	FileUploadService = "FileUploadService",
	BrowsingRepository = "BrowsingRepository",
}

export interface IContainer {
	get<T>(token: ETokens): T;
	has(token: ETokens): boolean;
	getInstantiatedTokens(): ETokens[];
	clear(): void;
}
