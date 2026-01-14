import { Match } from "../models";

export enum EWebSocketEvents {
	Connect = "connect",
	Disconnect = "disconnect",
	MatchCreated = "match:created",
}

export interface IWebSocketEventDtoMap {
	[EWebSocketEvents.Connect]: undefined;
	[EWebSocketEvents.Disconnect]: string;
	[EWebSocketEvents.MatchCreated]: Match;
}
