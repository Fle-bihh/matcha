import mysql from "mysql2/promise";
import { config } from "@/config";
import { logger } from "@matcha/shared";

export class DatabaseConnectionManager {
	private static instance: DatabaseConnectionManager | null = null;
	private pool: mysql.Pool | null = null;

	private constructor() {}

	static getInstance(): DatabaseConnectionManager {
		if (!DatabaseConnectionManager.instance) {
			DatabaseConnectionManager.instance =
				new DatabaseConnectionManager();
		}
		return DatabaseConnectionManager.instance;
	}

	async connect(): Promise<void> {
		const maxRetries = 10;
		const retryDelay = 10000; // 10 secondes

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				this.pool = mysql.createPool({
					host: config.database.host,
					user: config.database.user,
					password: config.database.password,
					database: config.database.database,
					connectionLimit: config.database.pool.connectionLimit,
					waitForConnections: true,
					queueLimit: 0,
				});

				const connection = await this.pool.getConnection();
				await connection.ping();
				connection.release();

				logger.info(
					`Database pool connected successfully with ${config.database.pool.connectionLimit} connections`
				);
				return;
			} catch (error) {
				logger.error(
					`Database connection attempt ${attempt}/${maxRetries} failed:`,
					error
				);

				if (attempt === maxRetries) {
					logger.error(
						"Database pool connection failed after all retries"
					);
					throw error;
				}

				logger.info(
					`Retrying database connection in ${
						retryDelay / 1000
					} seconds...`
				);
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
			}
		}
	}

	async disconnect(): Promise<void> {
		if (this.pool) {
			await this.pool.end();
			this.pool = null;
			logger.info("Database pool disconnected");
		}
	}

	getPool(): mysql.Pool {
		if (!this.pool) {
			throw new Error("Database pool not initialized");
		}
		return this.pool;
	}

	async getConnection(): Promise<mysql.PoolConnection> {
		const pool = this.getPool();
		try {
			const connection = await pool.getConnection();
			return connection;
		} catch (error) {
			logger.error("Failed to get connection from pool:", error);
			throw error;
		}
	}

	async executeQuery<T = any>(
		query: string,
		params?: any[]
	): Promise<[T[], mysql.FieldPacket[]]> {
		const pool = this.getPool();
		try {
			const [rows, fields] = await pool.execute(query, params);
			return [rows as T[], fields];
		} catch (error) {
			logger.error("Database query failed:", { query, params, error });
			throw error;
		}
	}

	isConnected(): boolean {
		return this.pool !== null;
	}

	async getPoolInfo(): Promise<{
		connectionLimit: number;
		activeConnections: number;
	} | null> {
		if (!this.pool) return null;

		try {
			const [rows] = await this.pool.execute(
				'SHOW STATUS WHERE variable_name = "Threads_connected"'
			);
			const threadsConnected = (rows as any)[0]?.Value || 0;

			return {
				connectionLimit: config.database.pool.connectionLimit,
				activeConnections: parseInt(threadsConnected, 10),
			};
		} catch (error) {
			logger.error("Failed to get pool info:", error);
			return {
				connectionLimit: config.database.pool.connectionLimit,
				activeConnections: 0,
			};
		}
	}
}
