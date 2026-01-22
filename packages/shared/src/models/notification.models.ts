import { BaseEntity } from "./base.models";

export enum NotificationType {
	LikeReceived = "like_received",
	ProfileViewed = "profile_viewed",
	MessageReceived = "message_received",
	NewMatch = "new_match",
	MatchCanceled = "match_canceled",
}

export interface LikeReceivedNotificationData {
	liker_first_name: string;
}

export interface ProfileViewedNotificationData {
	viewer_first_name: string;
}

export interface MessageReceivedNotificationData {
	sender_first_name?: string;
	message_preview: string;
}

export interface NewMatchNotificationData {
	match_first_name: string;
}

export interface MatchCanceledNotificationData {
	match_first_name: string;
}

export type NotificationDataMap = {
	[NotificationType.LikeReceived]: LikeReceivedNotificationData;
	[NotificationType.ProfileViewed]: ProfileViewedNotificationData;
	[NotificationType.MessageReceived]: MessageReceivedNotificationData;
	[NotificationType.NewMatch]: NewMatchNotificationData;
	[NotificationType.MatchCanceled]: MatchCanceledNotificationData;
};

export interface Notification extends BaseEntity {
	user_id: number;
	type: NotificationType;
	data: NotificationDataMap[NotificationType];
	read_at: string | null;
}
