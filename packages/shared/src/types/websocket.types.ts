import {
	DeleteMatchSocketDto,
	SubscribeChannelRequestDto,
	UnsubscribeChannelRequestDto,
	SubscriptionConfirmationDto,
	UserStatusUpdateDto,
	LikeCreatedSocketDto,
	LikeDeletedSocketDto,
	BlockCreatedSocketDto,
	MessageCreatedSocketDto,
} from "../dto";
import { MatchWithDetails } from "../models";

export enum EWebSocketEvents {
	Connect = "connect",
	Disconnect = "disconnect",
	MatchCreated = "match:created",
	MatchDeleted = "match:deleted",
	VisitCreated = "visit:created",
	LikeCreated = "like:created",
	LikeDeleted = "like:deleted",
	Subscribe = "subscribe",
	Unsubscribe = "unsubscribe",
	SubscriptionConfirmed = "subscription:confirmed",
	UserStatusUpdate = "user:status:update",
	BlockCreated = "block:created",
	MessageCreated = "message:created",
}

export interface IWebSocketEventDtoMap {
	[EWebSocketEvents.Connect]: undefined;
	[EWebSocketEvents.Disconnect]: string;
	[EWebSocketEvents.MatchCreated]: MatchWithDetails;
	[EWebSocketEvents.MatchDeleted]: DeleteMatchSocketDto;
	[EWebSocketEvents.VisitCreated]: undefined;
	[EWebSocketEvents.Subscribe]: SubscribeChannelRequestDto;
	[EWebSocketEvents.Unsubscribe]: UnsubscribeChannelRequestDto;
	[EWebSocketEvents.SubscriptionConfirmed]: SubscriptionConfirmationDto;
	[EWebSocketEvents.UserStatusUpdate]: UserStatusUpdateDto;
	[EWebSocketEvents.LikeCreated]: LikeCreatedSocketDto;
	[EWebSocketEvents.LikeDeleted]: LikeDeletedSocketDto;
	[EWebSocketEvents.BlockCreated]: BlockCreatedSocketDto;
	[EWebSocketEvents.MessageCreated]: MessageCreatedSocketDto;
}
