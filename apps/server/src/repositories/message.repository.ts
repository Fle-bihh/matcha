import { BaseRepository } from "./base.repository";
import { Message, Match, logger } from "@matcha/shared";
import { IContainer, ETokens } from "@/types";
import { MatchRepository } from "./match.repository";

export class MessageRepository extends BaseRepository {
	private readonly tableName = "messages";

	constructor(container: IContainer) {
		super(container);

		this.initializeTable().catch((err) => {
			logger.error("Error initializing MessageRepository table:", err);
		});
	}

	private get matchRepository(): MatchRepository {
		return this.container.get<MatchRepository>(ETokens.MatchRepository);
	}

	private async initializeTable(): Promise<void> {
		await this.createTableWithMetadata(
			this.tableName,
			`
				sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
				content TEXT NOT NULL,
				is_read BOOLEAN DEFAULT FALSE
			`,
			``
		);

		logger.info(`${this.tableName} table initialized`);
	}

	public async getUnreadCountByMatch(matchId: number): Promise<number> {
		try {
			return await this.countDocs(this.tableName, {
				where: "match_id = ? AND is_read = FALSE",
				values: [matchId],
			});
		} catch (error) {
			logger.error("Error getting unread count by match:", error);
			return 0;
		}
	}

	public async getLastMessageByMatch(
		matchId: number
	): Promise<Message | null> {
		try {
			const messages = await this.getDocs<Message>(this.tableName, {
				where: "match_id = ?",
				values: [matchId],
				orderBy: "created_at DESC",
				limit: 1,
			});
			return messages[0] || null;
		} catch (error) {
			logger.error("Error getting last message by match:", error);
			return null;
		}
	}

	public async createMessage(
		senderId: number,
		matchId: number,
		content: string
	): Promise<Message | null> {
		try {
			const message = await this.createDocument<Message>(this.tableName, {
				sender_id: senderId,
				match_id: matchId,
				content,
				is_read: false,
			});

			const match = await this.getDoc<Match>("matches", matchId);
			if (match) {
				const recipientUserId =
					match.user1_id === senderId
						? match.user2_id
						: match.user1_id;
				await this.matchRepository.incrementUnreadCount(
					matchId,
					recipientUserId
				);
			}

			return message;
		} catch (error) {
			logger.error("Error creating message:", error);
			return null;
		}
	}
}
