export class HelloService {
	private startTime = Date.now();

	public getGreeting(
		name?: string,
		greetingType: "standard" | "random" | "formal" = "standard"
	): {
		message: string;
		greeting_type: string;
		timestamp: string;
	} {
		let message: string;

		switch (greetingType) {
			case "random":
				message = this.getRandomGreeting(name);
				break;
			case "formal":
				message = this.getFormalGreeting(name);
				break;
			default:
				message = this.getStandardGreeting(name);
				break;
		}

		return {
			message,
			greeting_type: greetingType,
			timestamp: new Date().toISOString(),
		};
	}

	private getStandardGreeting(name?: string): string {
		if (name) {
			return `Hello, ${name}!`;
		}
		return "Hello World!";
	}

	private getRandomGreeting(name?: string): string {
		const greetings = [
			"Hello!",
			"Hi there!",
			"Greetings!",
			"Hey!",
			"Good day!",
		];
		const randomIndex = Math.floor(Math.random() * greetings.length);
		const baseGreeting = greetings[randomIndex];

		if (name) {
			return `${baseGreeting} ${name}!`;
		}
		return baseGreeting;
	}

	private getFormalGreeting(name?: string): string {
		if (name) {
			return `Good day, ${name}. I hope this message finds you well.`;
		}
		return "Good day. I hope this message finds you well.";
	}

	public getHealthStatus(includeDetails = false): {
		status: string;
		timestamp: string;
		service: string;
		uptime?: number;
		details?: {
			memory_usage?: NodeJS.MemoryUsage;
			cpu_usage?: number;
		};
	} {
		const baseStatus = {
			status: "healthy",
			timestamp: new Date().toISOString(),
			service: "HelloService",
		};

		if (includeDetails) {
			return {
				...baseStatus,
				uptime: Date.now() - this.startTime,
				details: {
					memory_usage: process.memoryUsage(),
					cpu_usage: process.cpuUsage().user / 1000000, // Convert to seconds
				},
			};
		}

		return baseStatus;
	}
}
