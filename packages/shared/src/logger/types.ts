export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
}

export interface LogEntry {
	timestamp: Date;
	level: LogLevel;
	message: string;
	data?: any;
}

export interface LogTransport {
	log(entry: LogEntry): void;
}
