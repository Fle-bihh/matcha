import dotenv from "dotenv-safe";
import path from "path";
import { requireEnv, requireNumberEnv } from "../core/utils/config.utils.js";

dotenv.config({
	example: path.resolve(process.cwd(), "../../.env.example"),
	path: path.resolve(process.cwd(), "../../.env"),
});

interface DatabaseConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	name: string;
}

interface AppConfig {
	apiPort: number;
	db: DatabaseConfig;
}

export const config: AppConfig = {
	apiPort: Number(process.env.API_PORT ?? 3000),
	db: {
		host: requireEnv("DB_HOST"),
		port: Number(requireNumberEnv("DB_PORT")) || 3306,
		user: requireEnv("DB_USER"),
		password: requireEnv("DB_PASSWORD"),
		name: requireEnv("DB_NAME"),
	},
};
