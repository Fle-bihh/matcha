class Config {
	public readonly apiUrl: string;

	constructor() {
		this.apiUrl =
			import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
	}
}

export const config = new Config();
