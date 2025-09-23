require("dotenv").config();

class Config {
	public readonly port: number;

	constructor() {
		this.port = Number(process.env.PORT) || 3000;
	}
}

export const config = new Config();
