import { BaseRepository, UserRepository } from "@/repositories";
import { HealthService, UserService, AuthService } from "@/services";
import { ETokens, IContainer } from "@/types";
import { logger } from "@matcha/shared";

type ServiceConstructor = new (container: IContainer) => any;

const serviceRegistry: Record<ETokens, ServiceConstructor> = {
	[ETokens.BaseRepository]: BaseRepository,
	[ETokens.HealthService]: HealthService,
	[ETokens.UserRepository]: UserRepository,
	[ETokens.UserService]: UserService,
	[ETokens.AuthService]: AuthService,
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
