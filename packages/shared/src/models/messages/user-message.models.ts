import { BaseMessage, MessageStatus, MessageType } from "./base-message.models";

export interface UserMessage extends BaseMessage {
	sender_id: number;
	type: MessageType.TEXT;
	received_at: string | null;
	read_at: string | null;
	status: MessageStatus;
}

interface ActiveMessage extends UserMessage {
	status: MessageStatus.SENT | MessageStatus.RECEIVED | MessageStatus.READ;
}

export interface TextMessage extends ActiveMessage {
	type: MessageType.TEXT;
	content: string;
}

export interface DeletedMessage extends UserMessage {
	status: MessageStatus.DELETED;
}
