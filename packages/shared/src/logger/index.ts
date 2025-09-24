export * from "./types";
export { ConsoleTransport } from "./ConsoleTransport";
export { Logger } from "./Logger";

import { Logger } from "./Logger";
import { ConsoleTransport } from "./ConsoleTransport";

export const logger = new Logger();
logger.addTransport(new ConsoleTransport());
