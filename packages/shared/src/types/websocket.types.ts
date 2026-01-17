import {
	DeleteMatchSocketDto,
	SubscribeChannelRequestDto,
	UnsubscribeChannelRequestDto,
	SubscriptionConfirmationDto,
	UserStatusUpdateDto,
} from "../dto";
import { Match } from "../models";

export enum EWebSocketEvents {
	Connect = "connect",
	Disconnect = "disconnect",
	MatchCreated = "match:created",
	MatchDeleted = "match:deleted",
	NewVisit = "visit:created",
	Subscribe = "subscribe",
	Unsubscribe = "unsubscribe",
	SubscriptionConfirmed = "subscription:confirmed",
	UserStatusUpdate = "user:status:update",
}

export interface IWebSocketEventDtoMap {
	[EWebSocketEvents.Connect]: undefined;
	[EWebSocketEvents.Disconnect]: string;
	[EWebSocketEvents.MatchCreated]: Match;
	[EWebSocketEvents.MatchDeleted]: DeleteMatchSocketDto;
	[EWebSocketEvents.NewVisit]: undefined;
	[EWebSocketEvents.Subscribe]: SubscribeChannelRequestDto;
	[EWebSocketEvents.Unsubscribe]: UnsubscribeChannelRequestDto;
	[EWebSocketEvents.SubscriptionConfirmed]: SubscriptionConfirmationDto;
	[EWebSocketEvents.UserStatusUpdate]: UserStatusUpdateDto;
}
