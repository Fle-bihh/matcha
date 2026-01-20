import { ETokens, IContainer, ServiceResponse } from "@/types";
import { MailService } from "./mail.service";
import { FileUploadService } from "./file-upload.service";
import { WebSocketService } from "./websocket.service";
import { EmailVerificationService } from "./email-verification.service";
import { PasswordResetService } from "./password-reset.service";
import { UserService } from "./user.service";
import { UserDeletionService } from "./user-deletion.service";
import { ReportService } from "./report.service";
import { BlockService } from "./block.service";
import { LikeService } from "./like.service";
import { MatchService } from "./match.service";
import { VisitService } from "./visit.service";
import { MessageService } from "./message.service";

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

	protected get userDeletionService(): UserDeletionService {
		return this.container.get<UserDeletionService>(
			ETokens.UserDeletionService,
		);
	}

	protected get reportService(): ReportService {
		return this.container.get<ReportService>(ETokens.ReportService);
	}

	protected get blockService(): BlockService {
		return this.container.get<BlockService>(ETokens.BlockService);
	}

	protected get likeService(): LikeService {
		return this.container.get<LikeService>(ETokens.LikeService);
	}

	protected get matchService(): MatchService {
		return this.container.get<MatchService>(ETokens.MatchService);
	}

	protected get visitService(): VisitService {
		return this.container.get<VisitService>(ETokens.VisitService);
	}

	protected get messageService(): MessageService {
		return this.container.get<MessageService>(ETokens.MessageService);
	}
}
