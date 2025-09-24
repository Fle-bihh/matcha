import "@matcha/shared";
import express, { Express } from "express";
import { config } from "./config";
import { ControllerRegistry } from "./registry/ControllerRegistry";
import { ServiceRegistry } from "./registry/ServiceRegistry";
import "./controllers";

class Server {
	private app: Express;
	private port: number;

	constructor(port: number) {
		this.app = express();
		this.port = port;
		this.setup();
	}

	private setup(): void {
		this.setupMiddleware();
		this.setupRoutes();
		this.setup404Handler();
	}

	private setupRoutes(): void {
		ControllerRegistry.setupRoutes(this.app);
	}

	private setupMiddleware(): void {
		this.app.use(express.json());
	}

	private setup404Handler(): void {
		this.app.use((req, res) => {
			res.status(404).send("Not Found");
		});
	}

	private async initializeDatabase(): Promise<void> {
		try {
			const baseRepository =
				ServiceRegistry.getInstance().getService("BaseRepository");
			await baseRepository.connect();
			console.log("Database connected successfully");

			const helloService =
				ServiceRegistry.getInstance().getService("HelloService");
			await helloService.initializeTable();
		} catch (error) {
			console.error("Failed to initialize database:", error);
		}
	}

	public async start(): Promise<void> {
		await this.initializeDatabase();
		this.app.listen(this.port, () => {});
		console.log(`Server is running on port ${this.port}`);
	}
}

const server = new Server(config.port);
server.start();
