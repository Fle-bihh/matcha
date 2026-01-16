import { DeleteMatchSocketDto } from "../dto";
import { Match } from "../models";

export enum EWebSocketEvents {
	Connect = "connect",
	Disconnect = "disconnect",
	MatchCreated = "match:created",
	MatchDeleted = "match:deleted",
}

export interface IWebSocketEventDtoMap {
	[EWebSocketEvents.Connect]: undefined;
	[EWebSocketEvents.Disconnect]: string;
	[EWebSocketEvents.MatchCreated]: Match;
	[EWebSocketEvents.MatchDeleted]: DeleteMatchSocketDto;
}
