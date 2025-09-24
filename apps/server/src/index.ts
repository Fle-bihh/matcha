import "@matcha/shared";
import express, { Express } from "express";
import { config } from "./config";
import { ControllerRegistry } from "./registry/ControllerRegistry";
import { Container } from "./container/Container";
import { ETokens } from "./types/container";
import { BaseRepository } from "@/repositories";
import "./controllers";
import { ServiceResponse } from "./types/ServiceResponse";
import { logger } from "@matcha/shared";

class Server {
	private app: Express;
	private port: number;
	private container: Container;

	constructor(port: number) {
		logger.info(`Starting server on port ${port}`);
		this.app = express();
		this.port = port;
		this.container = new Container();
		this.setup();
	}

	private setup(): void {
		this.setupMiddleware();
		this.setupRoutes();
		this.setup404Handler();
	}

	private setupRoutes(): void {
		ControllerRegistry.setupRoutes(this.app);
	}

	private setupMiddleware(): void {
		this.app.use(express.json());
	}

	private setup404Handler(): void {
		const response = ServiceResponse.failure("Not Found", null, 404);
		this.app.use((req, res) => {
			logger.debug(`404 Not Found: ${req.method} ${req.originalUrl}`);
			res.status(response.statusCode).send(response);
		});
	}

	private async initializeDatabase(): Promise<void> {
		try {
			const baseRepository = this.container.get<BaseRepository>(
				ETokens.BaseRepository
			);
			await baseRepository.connect();
		} catch (error) {
			logger.error("Failed to initialize database:", error);
		}
	}

	public async start(): Promise<void> {
		await this.initializeDatabase();
		this.app.listen(this.port, () => {});
		logger.info(`Server is running on port ${this.port}`);
	}
}

const server = new Server(config.port);
server.start();
