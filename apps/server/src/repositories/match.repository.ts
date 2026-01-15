import { BaseRepository } from "./base.repository";
import { Match, logger } from "@matcha/shared";
import { IContainer } from "@/types";

export class MatchRepository extends BaseRepository {
	private readonly tableName = "matches";

	constructor(container: IContainer) {
		super(container);

		this.initializeTable().catch((err) => {
			logger.error("Error initializing MatchRepository table:", err);
		});
	}

	private async initializeTable(): Promise<void> {
		await this.createTableWithMetadata(
			this.tableName,
			`
				user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
			`,
			`CONSTRAINT unique_match UNIQUE (user1_id, user2_id),
			 CONSTRAINT ordered_users CHECK (user1_id < user2_id)`
		);

		logger.info(`${this.tableName} table initialized`);
	}

	public async createMatch(
		userId1: number,
		userId2: number
	): Promise<Match | null> {
		try {
			const [user1_id, user2_id] =
				userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

			return await this.createDocument<Match>(this.tableName, {
				user1_id,
				user2_id,
				unread_messages_count_user1: 0,
				unread_messages_count_user2: 0,
			});
		} catch (error) {
			logger.error("Error creating match:", error);
			return null;
		}
	}
}
