class Config {
	public readonly port: number;
	public readonly webUrl: string;
	public readonly apiUrl: string;

	constructor() {
		const port = Number(import.meta.env.VITE_WEB_PORT);
		const isValidPort = Number.isInteger(port) && port > 0 && port < 65536;

		const webUrl = import.meta.env.VITE_WEB_URL;
		const isValidWebUrl =
			typeof webUrl === "string" && webUrl.startsWith("http");

		const apiUrl = import.meta.env.VITE_SERVER_URL;
		const isValidApiUrl =
			typeof apiUrl === "string" && apiUrl.startsWith("http");

		if (!isValidPort) {
			throw new Error("Invalid VITE_WEB_PORT");
		}
		if (!isValidWebUrl) {
			throw new Error("Invalid VITE_WEB_URL");
		}
		if (!isValidApiUrl) {
			throw new Error("Invalid VITE_SERVER_URL");
		}

		this.port = port;
		this.webUrl = webUrl;
		this.apiUrl = `${apiUrl}/api/v1`;
	}
}

export const config = new Config();
