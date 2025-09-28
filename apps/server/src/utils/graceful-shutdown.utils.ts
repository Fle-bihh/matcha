import { logger } from "@matcha/shared";
import { Server } from "http";
import { Container } from "@/container/container";
import { ETokens } from "@/types/container.types";
import { BaseRepository } from "@/repositories";

interface ShutdownOptions {
	timeout?: number;
	server?: Server;
	container?: Container;
}

export class GracefulShutdown {
	private static instance: GracefulShutdown | null = null;
	private isShuttingDown: boolean = false;
	private timeout: number;
	private server?: Server;
	private container?: Container;

	private constructor(options: ShutdownOptions = {}) {
		this.timeout = options.timeout || 30000; // 30 seconds default
		this.server = options.server;
		this.container = options.container;
	}

	public static getInstance(options?: ShutdownOptions): GracefulShutdown {
		if (!GracefulShutdown.instance) {
			GracefulShutdown.instance = new GracefulShutdown(options);
		}
		return GracefulShutdown.instance;
	}

	public configure(options: ShutdownOptions): void {
		this.timeout = options.timeout || this.timeout;
		this.server = options.server || this.server;
		this.container = options.container || this.container;
	}

	public setup(): void {
		process.on("SIGTERM", () => this.handleShutdown("SIGTERM"));
		process.on("SIGINT", () => this.handleShutdown("SIGINT"));

		process.on("uncaughtException", (error) => {
			logger.error("Uncaught Exception:", error);
			this.handleShutdown("UNCAUGHT_EXCEPTION");
		});

		process.on("unhandledRejection", (reason, promise) => {
			logger.error(
				`Unhandled Rejection at: ${promise}, reason: ${reason}`
			);
			this.handleShutdown("UNHANDLED_REJECTION");
		});
	}

	private async handleShutdown(signal: string): Promise<void> {
		if (this.isShuttingDown) {
			logger.warn(`${signal} received again, forcing exit`);
			process.exit(1);
		}

		this.isShuttingDown = true;
		logger.info(`${signal} received, starting graceful shutdown...`);

		const forceExitTimer = setTimeout(() => {
			logger.error("Graceful shutdown timeout reached, forcing exit");
			process.exit(1);
		}, this.timeout);

		try {
			// Close HTTP server
			await this.closeHttpServer();

			// Close database connection
			await this.closeDatabaseConnection();

			clearTimeout(forceExitTimer);
			logger.info("Graceful shutdown completed");
			process.exit(0);
		} catch (error) {
			clearTimeout(forceExitTimer);
			logger.error("Error during graceful shutdown:", error);
			process.exit(1);
		}
	}

	private async closeHttpServer(): Promise<void> {
		if (!this.server) {
			logger.debug("No HTTP server to close");
			return;
		}

		logger.info("Closing HTTP server...");
		return new Promise<void>((resolve, reject) => {
			this.server!.close((err: any) => {
				if (err) {
					logger.error("Error closing HTTP server:", err);
					reject(err);
				} else {
					logger.info("HTTP server closed");
					resolve();
				}
			});
		});
	}

	private async closeDatabaseConnection(): Promise<void> {
		if (!this.container) {
			logger.debug("No container available for database cleanup");
			return;
		}

		try {
			const baseRepository = this.container.get<BaseRepository>(
				ETokens.BaseRepository
			);
			await baseRepository.disconnect();
			logger.info("Database connection closed");
		} catch (error) {
			logger.error("Error closing database connection:", error);
			throw error;
		}
	}
}
