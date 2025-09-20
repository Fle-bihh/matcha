import mysql, { Pool } from "mysql2/promise";
import { config } from "../../config/config.js";

class MySQLPool {
	private static instance: Pool;

	public static getInstance(): Pool {
		if (!MySQLPool.instance) {
			MySQLPool.instance = mysql.createPool({
				host: config.db.host,
				port: config.db.port,
				user: config.db.user,
				password: config.db.password,
				database: config.db.name,
				waitForConnections: true,
				connectionLimit: 10,
			});
		}
		return MySQLPool.instance;
	}
}

export const pool = MySQLPool.getInstance();
