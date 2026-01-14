import {
	BaseRepository,
	UserRepository,
	EmailVerificationRepository,
	PasswordResetRepository,
	BrowsingRepository,
} from "@/repositories";
import { LikeRepository } from "@/repositories/like.repository";
import {
	HealthService,
	UserService,
	AuthService,
	MailService,
	EmailVerificationService,
	PasswordResetService,
	FileUploadService,
	UserDeletionService,
} from "@/services";
import { LikeService } from "@/services/like.service";
import { ETokens, IContainer } from "@/types";
import { logger } from "@matcha/shared";

type ServiceConstructor = new (container: IContainer) => any;

const serviceRegistry: Record<ETokens, ServiceConstructor> = {
	[ETokens.BaseRepository]: BaseRepository,
	[ETokens.HealthService]: HealthService,
	[ETokens.UserRepository]: UserRepository,
	[ETokens.UserService]: UserService,
	[ETokens.AuthService]: AuthService,
	[ETokens.MailService]: MailService,
	[ETokens.EmailVerificationRepository]: EmailVerificationRepository,
	[ETokens.EmailVerificationService]: EmailVerificationService,
	[ETokens.PasswordResetRepository]: PasswordResetRepository,
	[ETokens.PasswordResetService]: PasswordResetService,
	[ETokens.FileUploadService]: FileUploadService,
	[ETokens.BrowsingRepository]: BrowsingRepository,
	[ETokens.UserDeletionService]: UserDeletionService,
	[ETokens.LikeRepository]: LikeRepository,
	[ETokens.LikeService]: LikeService,
} as const;

export class Container implements IContainer {
	private readonly instances = new Map<ETokens, any>();

	constructor() {
		logger.debug("Container initialized");
	}

	public get<T>(token: ETokens): T {
		let instance = this.instances.get(token);

		if (!instance) {
			const ServiceConstructor = serviceRegistry[token];
			if (!ServiceConstructor) {
				throw new Error(`Service not found for token: ${token}`);
			}

			logger.debug(`Creating new instance for token: ${token}`);
			instance = new ServiceConstructor(this);
			this.instances.set(token, instance);
		}

		return instance;
	}

	public has(token: ETokens): boolean {
		return this.instances.has(token);
	}

	public getInstantiatedTokens(): ETokens[] {
		return Array.from(this.instances.keys());
	}

	public clear(): void {
		logger.debug("Clearing container instances");
		this.instances.clear();
	}
}
