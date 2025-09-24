import mysql from "mysql2/promise";
import { config } from "@/config";
import { logger } from "@matcha/shared";

export class DatabaseConnectionManager {
	private static instance: DatabaseConnectionManager | null = null;
	private connection: mysql.Connection | null = null;

	private constructor() {}

	static getInstance(): DatabaseConnectionManager {
		if (!DatabaseConnectionManager.instance) {
			DatabaseConnectionManager.instance =
				new DatabaseConnectionManager();
		}
		return DatabaseConnectionManager.instance;
	}

	async connect(): Promise<void> {
		try {
			this.connection = await mysql.createConnection({
				host: config.database.host,
				user: config.database.user,
				password: config.database.password,
				database: config.database.database,
			});
		} catch (error) {
			logger.error("Database connection failed:", error);
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		if (this.connection) {
			await this.connection.end();
			this.connection = null;
		}
	}

	getConnection(): mysql.Connection {
		if (!this.connection) {
			throw new Error("Database not connected");
		}
		return this.connection;
	}

	isConnected(): boolean {
		return this.connection !== null;
	}
}
