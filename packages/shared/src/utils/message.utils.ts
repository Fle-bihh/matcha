import {
	MatchStartedSystemMessageData,
	Message,
	MessageType,
	SystemMessage,
	SystemMessageType,
} from "../models";

function generateMatchStartedContent(
	data: MatchStartedSystemMessageData,
): string {
	return `${data.first_name_1} and ${data.first_name_2} matched on ${new Date(data.started_at).toLocaleString()}`;
}

const systemMessageContentGenerators = {
	[SystemMessageType.MatchStarted]: generateMatchStartedContent,
};

export function getSystemMessageContent(message: SystemMessage): string {
	const generator = systemMessageContentGenerators[message.system_type];
	if (!generator) {
		return "System message";
	}
	return generator(message.data as never);
}

export function getMessagePreview(message: Message, maxLength = 50): string {
	if (message.type === MessageType.User) {
		const userMessage = message as Message & { content: string };
		const preview = userMessage.content.trim();
		return preview.length > maxLength
			? `${preview.substring(0, maxLength)}...`
			: preview;
	} else {
		const systemMessage = message as SystemMessage;
		const systemContent = getSystemMessageContent(systemMessage);
		return systemContent.length > maxLength
			? `${systemContent.substring(0, maxLength)}...`
			: systemContent;
	}
}
