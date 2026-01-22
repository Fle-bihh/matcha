import {
	LikeReceivedNotificationData,
	MatchCanceledNotificationData,
	MessageReceivedNotificationData,
	NewMatchNotificationData,
	Notification,
	NotificationType,
	ProfileViewedNotificationData,
} from "../models";

function generateLikeReceivedContent(
	data: LikeReceivedNotificationData,
): string {
	return `${data.liker_first_name} liked your profile`;
}

function generateProfileViewedContent(
	data: ProfileViewedNotificationData,
): string {
	return `${data.viewer_first_name} viewed your profile`;
}

function generateMessageReceivedContent(
	data: MessageReceivedNotificationData,
): string {
	const senderName = data.sender_first_name ?? "Someone";
	return `${senderName} sent you a message: ${data.message_preview}`;
}

function generateNewMatchContent(data: NewMatchNotificationData): string {
	return `You matched with ${data.match_first_name}!`;
}

function generateMatchCanceledContent(
	data: MatchCanceledNotificationData,
): string {
	return `Your match with ${data.match_first_name} was canceled`;
}

const notificationContentGenerators = {
	[NotificationType.LikeReceived]: generateLikeReceivedContent,
	[NotificationType.ProfileViewed]: generateProfileViewedContent,
	[NotificationType.MessageReceived]: generateMessageReceivedContent,
	[NotificationType.NewMatch]: generateNewMatchContent,
	[NotificationType.MatchCanceled]: generateMatchCanceledContent,
};

export function getNotificationContent(notification: Notification): string {
	const generator = notificationContentGenerators[notification.type];
	if (!generator) {
		return "New notification";
	}
	return generator(notification.data as never);
}
