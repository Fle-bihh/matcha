import { BaseMessage, MessageType } from "./base-message.models";

export enum SystemMessageType {
	MATCH_CREATED = "match_created",
}

interface BaseSystemMessage extends BaseMessage {
	type: MessageType.SYSTEM;
	systemType: SystemMessageType;
	data: MatchCreatedSystemMessageData | null;
	read_by_user1_at: string | null;
	read_by_user2_at: string | null;
}

export interface MatchCreatedSystemMessageData {
	username1: string;
	username2: string;
	matchedAt: string;
}

export interface MatchCreatedSystemMessage extends BaseSystemMessage {
	systemType: SystemMessageType.MATCH_CREATED;
	data: MatchCreatedSystemMessageData;
}

export type SystemMessage = MatchCreatedSystemMessage;
