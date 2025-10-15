import { Container } from "@/container/container";
import { BaseRepository } from "@/repositories";
import { ETokens } from "@/types";
import { logger } from "@matcha/shared";

export class ContainerSetup {
	private container: Container;

	constructor() {
		this.container = new Container();
	}

	public async initialize(): Promise<void> {
		logger.info("Initializing container...");

		this.preloadCriticalServices();

		logger.info("Container initialized successfully");
	}

	private preloadCriticalServices(): void {
		this.container.get<BaseRepository>(ETokens.BaseRepository);

		logger.debug("Critical services preloaded");
	}

	public getContainer(): Container {
		return this.container;
	}

	public getContainerInfo(): {
		instantiatedServices: ETokens[];
		totalRegisteredServices: number;
	} {
		return {
			instantiatedServices: this.container.getInstantiatedTokens(),
			totalRegisteredServices: Object.keys(ETokens).length,
		};
	}
}
