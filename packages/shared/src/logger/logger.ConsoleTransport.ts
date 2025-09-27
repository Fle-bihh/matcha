import { LogEntry, LogTransport, LogLevel } from "./logger.types";

export class ConsoleTransport implements LogTransport {
	private colors = {
		reset: "\x1b[0m",
		debug: "\x1b[36m",
		info: "\x1b[32m",
		warn: "\x1b[33m",
		error: "\x1b[31m",
		timestamp: "\x1b[90m",
	};

	log(entry: LogEntry): void {
		const timestamp = entry.timestamp.toISOString();
		const level = LogLevel[entry.level];

		let levelColor: string;
		switch (entry.level) {
			case LogLevel.DEBUG:
				levelColor = this.colors.debug;
				break;
			case LogLevel.INFO:
				levelColor = this.colors.info;
				break;
			case LogLevel.WARN:
				levelColor = this.colors.warn;
				break;
			case LogLevel.ERROR:
				levelColor = this.colors.error;
				break;
			default:
				levelColor = this.colors.reset;
		}

		const coloredMessage = `${this.colors.timestamp}[${timestamp}]${this.colors.reset} ${levelColor}${level}${this.colors.reset}: ${entry.message}`;

		if (entry.level >= LogLevel.ERROR) {
			console.error(coloredMessage, entry.data || "");
		} else if (entry.level >= LogLevel.WARN) {
			console.warn(coloredMessage, entry.data || "");
		} else {
			console.log(coloredMessage, entry.data || "");
		}
	}
}
