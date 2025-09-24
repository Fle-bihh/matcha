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
		try {
			this.pool = mysql.createPool({
				host: config.database.host,
				user: config.database.user,
				password: config.database.password,
				database: config.database.database,
				connectionLimit: config.database.pool.connectionLimit,
				// Configuration additionnelle recommandée pour les pools
				waitForConnections: true,
				queueLimit: 0,
			});

			// Test de la connexion pool
			const connection = await this.pool.getConnection();
			await connection.ping();
			connection.release();

			logger.info(
				`Database pool connected successfully with ${config.database.pool.connectionLimit} connections`
			);
		} catch (error) {
			logger.error("Database pool connection failed:", error);
			throw error;
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

	// Méthode pour obtenir des informations sur le pool
	async getPoolInfo(): Promise<{
		connectionLimit: number;
		activeConnections: number;
	} | null> {
		if (!this.pool) return null;

		try {
			// Pour obtenir le nombre de connexions actives, on peut utiliser une requête
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
