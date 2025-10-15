import "@matcha/shared";
import "@/controllers";

import { config } from "@/config";
import { ApplicationSetup } from "@/setup";
import { logger } from "@matcha/shared";

async function main(): Promise<void> {
	try {
		const app = new ApplicationSetup(config.port);
		await app.initialize();
	} catch (error) {
		logger.error("Failed to start application:", error);
		process.exit(1);
	}
}

main();
