import { BaseEntity } from "../base.models";

export enum MessageType {
	TEXT = "text",
	SYSTEM = "system",
}

export enum MessageStatus {
	SENT = "sent",
	RECEIVED = "received",
	READ = "read",
	DELETED = "deleted",
}

export interface BaseMessage extends BaseEntity {
	id: number;
	match_id: number;
}
