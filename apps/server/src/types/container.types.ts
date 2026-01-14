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
	UserDeletionService = "UserDeletionService",
	LikeRepository = "LikeRepository",
	LikeService = "LikeService",
	MatchRepository = "MatchRepository",
	WebSocketService = "WebSocketService",
}

export interface IContainer {
	get<T>(token: ETokens): T;
	has(token: ETokens): boolean;
	getInstantiatedTokens(): ETokens[];
	clear(): void;
}
