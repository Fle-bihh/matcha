import { Container } from "@/container/container";
import { BaseRepository } from "@/repositories";
import { ETokens } from "@/types";
import { logger } from "@matcha/shared";
import { RepositorySchemaSetup } from "./repository-schema.setup";

export class DatabaseSetup {
	private container: Container;
	private repositorySchemaSetup: RepositorySchemaSetup;

	constructor(container: Container) {
		this.container = container;
		this.repositorySchemaSetup = new RepositorySchemaSetup(container);
	}

	public async initialize(): Promise<void> {
		try {
			logger.info("Initializing database...");

			const baseRepository = this.container.get<BaseRepository>(
				ETokens.BaseRepository
			);

			await baseRepository.connect();

			await this.repositorySchemaSetup.initialize();

			logger.info("Database initialized successfully");
		} catch (error) {
			logger.error("Failed to initialize database:", error);
			throw error;
		}
	}
}
