import { BaseRepository } from "./base.repository";
import { IContainer, IRepository, TableSchema } from "@/types";
import {
	Message,
	MessageType,
	SystemMessageType,
	SystemMessageDataMap,
	logger,
	UserMessage,
	SystemMessage,
} from "@matcha/shared";

export class MessageRepository extends BaseRepository implements IRepository {
	private readonly tableName = "messages";

	constructor(container: IContainer) {
		super(container);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `
				type VARCHAR(10) NOT NULL CHECK (type IN ('user', 'system')),
				sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
				match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
				content TEXT,
				system_type VARCHAR(50),
				data JSON
			`,
			constraints: "",
		};
	}

	public async createUserMessage(
		matchId: number,
		senderId: number,
		content: string,
	): Promise<UserMessage | null> {
		try {
			return await this.createDocument<UserMessage>(this.tableName, {
				type: MessageType.User,
				sender_id: senderId,
				match_id: matchId,
				content,
			});
		} catch (error) {
			logger.error("Error creating user message:", error);
			return null;
		}
	}

	public async createSystemMessage<T extends SystemMessageType>(
		matchId: number,
		systemType: T,
		data: SystemMessageDataMap[T],
	): Promise<SystemMessage | null> {
		try {
			return await this.createDocument<SystemMessage>(this.tableName, {
				type: MessageType.System,
				match_id: matchId,
				system_type: systemType,
				data,
			});
		} catch (error) {
			logger.error("Error creating system message:", error);
			return null;
		}
	}

	public async getMessages(
		matchId: number,
		limit: number,
		offset: number,
	): Promise<{ messages: Message[]; total: number }> {
		try {
			const messages = await this.getDocs<Message>(this.tableName, {
				where: "match_id = ?",
				values: [matchId],
				orderBy: "created_at DESC",
				limit,
				offset,
			});

			const total = await this.countDocs(this.tableName, {
				where: "match_id = ?",
				values: [matchId],
			});

			return { messages, total };
		} catch (error) {
			logger.error("Error fetching messages:", error);
			return { messages: [], total: 0 };
		}
	}
}
