export * from "./logger.types";
export { ConsoleTransport } from "./logger.ConsoleTransport";
export { Logger } from "./logger.Logger";

import { Logger } from "./logger.Logger";
import { ConsoleTransport } from "./logger.ConsoleTransport";

export const logger = new Logger();
logger.addTransport(new ConsoleTransport());
