import dotenv from "dotenv-safe";

dotenv.config({
	example: "../../.env.example",
	path: "../../.env",
});

export const config = {
	apiPort: process.env.API_PORT!,
	db: {
		host: process.env.DB_HOST || "localhost",
		port: Number(process.env.DB_PORT) || 3306,
		user: process.env.DB_USER!,
		password: process.env.DB_PASSWORD!,
		name: process.env.DB_NAME!,
	},
};
