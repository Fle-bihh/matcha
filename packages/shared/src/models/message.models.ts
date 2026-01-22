import { BaseEntity } from "./base.models";

export enum MessageType {
	User = "user",
	System = "system",
}

export interface BaseMessage extends BaseEntity {
	type: MessageType;
	match_id: number;
}

export type Message = UserMessage | SystemMessage;

export interface UserMessage extends BaseMessage {
	sender_id: number;
	content: string;
}

export enum SystemMessageType {
	MatchStarted = "match_started",
}

export type SystemMessageDataMap = {
	[SystemMessageType.MatchStarted]: MatchStartedSystemMessageData;
};

export interface MatchStartedSystemMessageData {
	first_name_1: string;
	first_name_2: string;
	started_at: string;
}

export interface SystemMessage extends BaseMessage {
	system_type: SystemMessageType;
	data: SystemMessageDataMap[SystemMessageType];
}
