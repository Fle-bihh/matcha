require("dotenv").config();

class Config {
	public readonly port: number;
	public readonly database: {
		host: string;
		user: string;
		password: string;
		database: string;
		pool: {
			connectionLimit: number;
		};
	};

	constructor() {
		this.port = Number(process.env.PORT) || 3000;
		this.database = {
			host: process.env.DB_HOST || "localhost",
			user: process.env.DB_USER || "root",
			password: process.env.DB_PASSWORD || "",
			database: process.env.DB_NAME || "matcha",
			pool: {
				connectionLimit:
					Number(process.env.DB_POOL_CONNECTION_LIMIT) || 10,
			},
		};
	}
}

export const config = new Config();
