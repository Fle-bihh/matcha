import "@matcha/shared";
import "@/controllers";

import { ContainerSetup } from "./container.setup";
import { DatabaseSetup } from "./database.setup";
import { ServerSetup } from "./server.setup";
import { logger } from "@matcha/shared";

export class ApplicationSetup {
	private containerSetup: ContainerSetup;
	private databaseSetup: DatabaseSetup;
	private serverSetup: ServerSetup;

	constructor(port: number) {
		this.containerSetup = new ContainerSetup();
		this.databaseSetup = new DatabaseSetup(
			this.containerSetup.getContainer()
		);
		this.serverSetup = new ServerSetup(
			this.containerSetup.getContainer(),
			port
		);
	}

	public async initialize(): Promise<void> {
		try {
			logger.info("Starting application initialization...");

			await this.containerSetup.initialize();

			await this.databaseSetup.initialize();

			await this.serverSetup.initialize();

			const containerInfo = this.containerSetup.getContainerInfo();
			logger.info("Container status:", containerInfo);

			logger.info("Application initialized successfully");
		} catch (error) {
			logger.error("Failed to initialize application:", error);
			throw error;
		}
	}

	public getContainer() {
		return this.containerSetup.getContainer();
	}
}
