import express, { Application } from "express";
import { config } from "../config/config.js";
import { exampleRoutes } from "../features/example/routes/example.routes.js";

export class Server {
	private readonly app: Application;

	constructor() {
		this.app = express();
		this.configureMiddleware();
		this.configureRoutes();
	}

	private configureMiddleware(): void {
		// Add middlewares here (bodyParser, cors, logging, etc.)
		this.app.use(express.json());
	}

	private configureRoutes(): void {
		// Feature-driven routes
		this.app.use("/api", exampleRoutes);
	}

	public listen(): void {
		this.app.listen(config.apiPort, () => {
			console.log(
				`🚀 Server running at http://localhost:${config.apiPort}`
			);
		});
	}
}

export const createServer = (): Server => {
	return new Server();
};
