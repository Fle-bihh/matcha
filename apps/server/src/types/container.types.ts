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
	MessageRepository = "MessageRepository",
	WebSocketService = "WebSocketService",
	MatchService = "MatchService",
	VisitRepository = "VisitRepository",
	VisitService = "VisitService",
	UserStatusRepository = "UserStatusRepository",
}

export const REPOSITORY_TOKENS: ETokens[] = [
	ETokens.UserRepository,
	ETokens.EmailVerificationRepository,
	ETokens.PasswordResetRepository,
	ETokens.BrowsingRepository,
	ETokens.LikeRepository,
	ETokens.MatchRepository,
	ETokens.MessageRepository,
	ETokens.VisitRepository,
	ETokens.UserStatusRepository,
];

export interface IContainer {
	get<T>(token: ETokens): T;
	has(token: ETokens): boolean;
	getInstantiatedTokens(): ETokens[];
	clear(): void;
	getRepositories(): any[];
}
