import "@matcha/shared";
import express, { Express } from "express";
import { config } from "./config";
import { Router } from "./routing/Router";
import { ControllerLoader } from "./loaders/ControllerLoader";

class Server {
	private app: Express;
	private port: number;
	private router: Router;

	constructor(port: number) {
		this.app = express();
		this.port = port;
		this.router = new Router(this.app);
		this.setupRoutes();
	}

	private setupRoutes(): void {
		const controllers = ControllerLoader.loadAllControllers();
		controllers.forEach((controller) => {
			this.router.addController(controller);
		});
		this.router.setupRoutes();
	}

	public start(): void {
		this.app.listen(this.port, () => {
			console.log(`Example app listening on port ${this.port}`);
		});
	}
}

const server = new Server(config.port);
server.start();
