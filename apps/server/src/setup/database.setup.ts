import { Container } from "@/container/container";
import { BaseRepository } from "@/repositories";
import { ETokens } from "@/types";
import { logger } from "@matcha/shared";

export class DatabaseSetup {
	private container: Container;

	constructor(container: Container) {
		this.container = container;
	}

	public async initialize(): Promise<void> {
		try {
			logger.info("Initializing database...");

			const baseRepository = this.container.get<BaseRepository>(
				ETokens.BaseRepository
			);

			await baseRepository.connect();

			logger.info("Database initialized successfully");
		} catch (error) {
			logger.error("Failed to initialize database:", error);
			throw error;
		}
	}
}
