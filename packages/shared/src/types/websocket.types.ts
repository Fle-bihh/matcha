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

export enum WebSocketEvents {
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

export interface NotificationSocketDto {
	notification?: string;
}

export interface WebSocketEventDtoMap {
	[WebSocketEvents.Connect]: undefined;
	[WebSocketEvents.Disconnect]: string;
	[WebSocketEvents.MatchCreated]: MatchWithDetails & NotificationSocketDto;
	[WebSocketEvents.MatchDeleted]: DeleteMatchSocketDto &
		NotificationSocketDto;
	[WebSocketEvents.VisitCreated]: NotificationSocketDto;
	[WebSocketEvents.Subscribe]: SubscribeChannelRequestDto;
	[WebSocketEvents.Unsubscribe]: UnsubscribeChannelRequestDto;
	[WebSocketEvents.SubscriptionConfirmed]: SubscriptionConfirmationDto;
	[WebSocketEvents.UserStatusUpdate]: UserStatusUpdateDto;
	[WebSocketEvents.LikeCreated]: LikeCreatedSocketDto & NotificationSocketDto;
	[WebSocketEvents.LikeDeleted]: LikeDeletedSocketDto & NotificationSocketDto;
	[WebSocketEvents.BlockCreated]: BlockCreatedSocketDto;
	[WebSocketEvents.MessageCreated]: MessageCreatedSocketDto &
		NotificationSocketDto;
}
