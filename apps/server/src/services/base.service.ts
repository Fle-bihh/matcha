import { ETokens, IContainer, ServiceResponse } from "@/types";
import { MailService } from "./mail.service";
import { FileUploadService } from "./file-upload.service";
import { WebSocketService } from "./websocket.service";
import { EmailVerificationService } from "./email-verification.service";
import { PasswordResetService } from "./password-reset.service";
import { UserService } from "./user.service";
import {
	EmailVerificationRepository,
	LikeRepository,
	MatchRepository,
	PasswordResetRepository,
	UserRepository,
	UserStatusRepository,
	VisitRepository,
} from "@/repositories";
import { UserDeletionService } from "./user-deletion.service";
import { ReportService } from "./report.service";

export abstract class BaseService {
	protected container: IContainer;

	constructor(container: IContainer) {
		this.container = container;
	}

	protected isSuccess<T>(response: ServiceResponse<T>): boolean {
		return response.statusCode >= 200 && response.statusCode < 300;
	}

	protected get mailService() {
		return this.container.get<MailService>(ETokens.MailService);
	}

	protected get fileUploadService(): FileUploadService {
		return this.container.get<FileUploadService>(ETokens.FileUploadService);
	}

	protected get webSocketService() {
		return this.container.get<WebSocketService>(ETokens.WebSocketService);
	}

	protected get userService(): UserService {
		return this.container.get<UserService>(ETokens.UserService);
	}

	protected get emailVerificationService(): EmailVerificationService {
		return this.container.get<EmailVerificationService>(
			ETokens.EmailVerificationService,
		);
	}

	protected get passwordResetService(): PasswordResetService {
		return this.container.get<PasswordResetService>(
			ETokens.PasswordResetService,
		);
	}

	protected get emailVerificationRepository(): EmailVerificationRepository {
		return this.container.get<EmailVerificationRepository>(
			ETokens.EmailVerificationRepository,
		);
	}

	protected get likeRepository(): LikeRepository {
		return this.container.get<LikeRepository>(ETokens.LikeRepository);
	}

	protected get matchRepository(): MatchRepository {
		return this.container.get<MatchRepository>(ETokens.MatchRepository);
	}

	protected get passwordResetRepository(): PasswordResetRepository {
		return this.container.get<PasswordResetRepository>(
			ETokens.PasswordResetRepository,
		);
	}

	protected get userRepository(): UserRepository {
		return this.container.get<UserRepository>(ETokens.UserRepository);
	}

	protected get userStatusRepository(): UserStatusRepository {
		return this.container.get<UserStatusRepository>(
			ETokens.UserStatusRepository,
		);
	}

	protected get userDeletionService(): UserDeletionService {
		return this.container.get<UserDeletionService>(
			ETokens.UserDeletionService,
		);
	}

	protected get visitRepository(): VisitRepository {
		return this.container.get<VisitRepository>(ETokens.VisitRepository);
	}

	protected get reportService(): ReportService {
		return this.container.get<ReportService>(ETokens.ReportService);
	}
}
