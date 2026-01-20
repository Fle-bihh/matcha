import {
	SystemMessage,
	SystemMessageType,
	MatchStartedSystemMessageData,
} from "@matcha/shared";

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
