import { LogLevel, LogEntry, LogTransport } from "./logger.types";

export class Logger {
	private transports: LogTransport[] = [];
	private minLevel: LogLevel = LogLevel.DEBUG;

	addTransport(transport: LogTransport): void {
		this.transports.push(transport);
	}

	setLevel(level: LogLevel): void {
		this.minLevel = level;
	}

	private log(level: LogLevel, message: string, data?: any): void {
		if (level < this.minLevel) return;

		const entry: LogEntry = {
			timestamp: new Date(),
			level,
			message,
			data,
		};

		this.transports.forEach((transport) => transport.log(entry));
	}

	debug(message: string, data?: any): void {
		this.log(LogLevel.DEBUG, message, data);
	}

	info(message: string, data?: any): void {
		this.log(LogLevel.INFO, message, data);
	}

	warn(message: string, data?: any): void {
		this.log(LogLevel.WARN, message, data);
	}

	error(message: string, data?: any): void {
		this.log(LogLevel.ERROR, message, data);
	}
}
