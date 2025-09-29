import "reflect-metadata";
import "@matcha/shared";
import "@/controllers";

import { ContainerSetup } from "./container.setup";
import { DatabaseSetup } from "./database.setup";
import { ServerSetup } from "./server.setup";
import { logger } from "@matcha/shared";

export class ApplicationSetup {
	private containerBootstrap: ContainerSetup;
	private databaseBootstrap: DatabaseSetup;
	private serverBootstrap: ServerSetup;

	constructor(port: number) {
		this.containerBootstrap = new ContainerSetup();
		this.databaseBootstrap = new DatabaseSetup(
			this.containerBootstrap.getContainer()
		);
		this.serverBootstrap = new ServerSetup(
			this.containerBootstrap.getContainer(),
			port
		);
	}

	public async initialize(): Promise<void> {
		try {
			logger.info("Starting application initialization...");

			await this.containerBootstrap.initialize();

			await this.databaseBootstrap.initialize();

			await this.serverBootstrap.initialize();

			const containerInfo = this.containerBootstrap.getContainerInfo();
			logger.info("Container status:", containerInfo);

			logger.info("Application initialized successfully");
		} catch (error) {
			logger.error("Failed to initialize application:", error);
			throw error;
		}
	}

	public getContainer() {
		return this.containerBootstrap.getContainer();
	}
}
