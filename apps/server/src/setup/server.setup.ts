import express, { Express } from "express";
import { Container } from "@/container/container";
import { ControllerRegistry } from "@/registry/controller.registry";
import { GracefulShutdown } from "@/utils/graceful-shutdown.utils";
import { logger } from "@matcha/shared";
import { ServiceResponse } from "@/types";
import {
	limiter,
	corsOptions,
	helmetConfig,
	sqlSanitize,
	xssSanitize,
	hppMiddleware,
} from "@/middleware/security.middleware";
import cors from "cors";
import multer from "multer";

export class ServerSetup {
	private container: Container;
	private app: Express;
	private port: number;
	private server: any;
	private gracefulShutdown: GracefulShutdown;
	private controllerRegistry: ControllerRegistry;

	constructor(container: Container, port: number) {
		this.container = container;
		this.port = port;
		this.app = express();
		this.gracefulShutdown = GracefulShutdown.getInstance();
		this.controllerRegistry = new ControllerRegistry(this.container);
	}

	public async initialize(): Promise<void> {
		this.setupMiddleware();
		this.setupRoutes();
		this.setup404Handler();
		await this.start();
	}

	private setupMiddleware(): void {
		const upload = multer();

		this.app.use(helmetConfig);
		this.app.use(limiter);
		this.app.use(express.json({ limit: "10mb" }));
		this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
		this.app.use(upload.none());
		this.app.use(cors(corsOptions));
		this.app.use(hppMiddleware);
		this.app.use(sqlSanitize);
		this.app.use(xssSanitize);
	}

	private setupRoutes(): void {
		this.controllerRegistry.setupRoutes(this.app);
	}

	private setup404Handler(): void {
		const response = ServiceResponse.failure("Not Found", null, 404);
		this.app.use((req, res) => {
			logger.debug(`404 Not Found: ${req.method} ${req.originalUrl}`);
			res.status(response.statusCode).send(response);
		});
	}

	private async start(): Promise<void> {
		this.server = this.app.listen(this.port, () => {
			logger.info(`Server is running on port ${this.port}`);
		});

		this.gracefulShutdown.configure({
			server: this.server,
			container: this.container,
			timeout: 30000, // 30 seconds
		});
		this.gracefulShutdown.setup();
	}

	public getApp(): Express {
		return this.app;
	}
}
