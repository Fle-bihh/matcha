export * from "./messages";
import { DeletedMessage, SystemMessage, TextMessage } from "./messages";

export type Message = TextMessage | SystemMessage | DeletedMessage;
