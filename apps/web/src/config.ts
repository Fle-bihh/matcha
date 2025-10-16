import dotenv from "dotenv";
dotenv.config();

class Config {
	public readonly port: number;
	public readonly webUrl: string;
	public readonly apiUrl: string;

	constructor() {
		this.port = Number(process.env.WEB_PORT) || 3001;
		this.webUrl = process.env.WEB_URL || "http://localhost:3001";
		this.apiUrl = process.env.API_URL || "http://localhost:3000";
	}
}

export const config = new Config();
