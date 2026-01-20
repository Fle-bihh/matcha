import { BaseRepository } from "./base.repository";
import { Match, MatchWithDetails, Message, User, logger } from "@matcha/shared";
import { ETokens, IContainer, IRepository, TableSchema } from "@/types";
import { MessageRepository } from "./message.repository";

export class MatchRepository extends BaseRepository implements IRepository {
	private readonly tableName = "matches";

	constructor(container: IContainer) {
		super(container);

		container.get<MessageRepository>(ETokens.MessageRepository);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `
				user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				unread_messages_count_user1 INTEGER DEFAULT 0 NOT NULL,
				unread_messages_count_user2 INTEGER DEFAULT 0 NOT NULL
			`,
			constraints: `CONSTRAINT ordered_users CHECK (user1_id < user2_id)`,
		};
	}

	public async createMatch(
		userId1: number,
		userId2: number,
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

	public async getMatchByUsers(
		userId1: number,
		userId2: number,
	): Promise<Match | null> {
		try {
			const [user1_id, user2_id] =
				userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

			const matches = await this.getDocs<Match>(this.tableName, {
				where: "user1_id = ? AND user2_id = ?",
				values: [user1_id, user2_id],
				limit: 1,
			});
			return matches[0] || null;
		} catch (error) {
			logger.error("Error fetching match:", error);
			return null;
		}
	}

	public async getMatchByIdWithDetails(
		matchId: number,
		otherUserId: number,
	): Promise<MatchWithDetails | null> {
		try {
			const query = `
				SELECT 
					m.id,
					m.user1_id,
					m.user2_id,
					m.unread_messages_count_user1,
					m.unread_messages_count_user2,
					m.created_at,
					m.updated_at,
					m.deleted_at,
					COALESCE(u.id, u2.id) as user_id,
					COALESCE(u.first_name, u2.first_name) as first_name,
					COALESCE(u.last_name, u2.last_name) as last_name,
					COALESCE(u.gender, u2.gender) as gender,
					COALESCE(u.orientation, u2.orientation) as orientation,
					COALESCE(u.age, u2.age) as age,
					COALESCE(u.bio, u2.bio) as bio,
					COALESCE(u.pictures_urls, u2.pictures_urls) as pictures_urls,
					COALESCE(u.interests, u2.interests) as interests,
					COALESCE(u.location, u2.location) as location,
					COALESCE(u.fame_score, u2.fame_score) as fame_score,
					COALESCE(u.created_at, u2.created_at) as user_created_at,
					COALESCE(u.updated_at, u2.updated_at) as user_updated_at,
					COALESCE(u.deleted_at, u2.deleted_at) as user_deleted_at,
					msg.id as last_message_id,
					msg.sender_id as last_message_sender_id,
					msg.match_id as last_message_match_id,
					msg.content as last_message_content,
					msg.is_read as last_message_is_read,
					msg.created_at as last_message_created_at,
					msg.updated_at as last_message_updated_at,
					msg.deleted_at as last_message_deleted_at
				FROM matches m
				LEFT JOIN users u ON u.id = m.user2_id AND m.user1_id = ${otherUserId}
				LEFT JOIN users u2 ON u2.id = m.user1_id AND m.user2_id = ${otherUserId}
				LEFT JOIN LATERAL (
				SELECT 
					id, 
					sender_id, 
					match_id, 
					type,
					content, 
					status,
					received_at,
					read_at,
					created_at, 
					updated_at, 
					deleted_at
					FROM messages
					WHERE match_id = m.id AND deleted_at IS NULL
					ORDER BY created_at DESC
					LIMIT 1
				) msg ON true
				WHERE m.id = ${matchId}
					AND m.deleted_at IS NULL
					AND (u.deleted_at IS NULL OR u2.deleted_at IS NULL)
			`;

			const [rows] = await this.executeQuery<any>(query, []);
			if (rows.length === 0) return null;

			return this.mapRowToMatchWithDetails(rows[0], otherUserId);
		} catch (error) {
			logger.error("Error fetching match with details:", error);
			return null;
		}
	}

	public async deleteMatch(id: number): Promise<boolean> {
		try {
			const result = await this.deleteDoc(this.tableName, id);
			return result;
		} catch (error) {
			logger.error("Error deleting match:", error);
			return false;
		}
	}

	public async getMatchesWithDetails(
		userId: number,
		limit: number,
		offset: number,
		unreadOnly: boolean,
	): Promise<MatchWithDetails[]> {
		try {
			const query = this.buildMatchesQuery(
				userId,
				limit,
				offset,
				unreadOnly,
			);
			const [rows] = await this.executeQuery<any>(query, []);
			return rows.map((row) =>
				this.mapRowToMatchWithDetails(row, userId),
			);
		} catch (error) {
			logger.error("Error fetching matches with details:", error);
			throw error;
		}
	}

	private buildMatchesQuery(
		userId: number,
		limit: number,
		offset: number,
		unreadOnly: boolean,
	): string {
		const unreadFilter = unreadOnly
			? `AND ((m.user1_id = ${userId} AND m.unread_messages_count_user1 > 0) OR (m.user2_id = ${userId} AND m.unread_messages_count_user2 > 0))`
			: "";

		return `
			SELECT 
				m.id,
				m.user1_id,
				m.user2_id,
				m.unread_messages_count_user1,
				m.unread_messages_count_user2,
				m.created_at,
				m.updated_at,
				m.deleted_at,
				COALESCE(u.id, u2.id) as user_id,
				COALESCE(u.first_name, u2.first_name) as first_name,
				COALESCE(u.last_name, u2.last_name) as last_name,
				COALESCE(u.gender, u2.gender) as gender,
				COALESCE(u.orientation, u2.orientation) as orientation,
				COALESCE(u.age, u2.age) as age,
				COALESCE(u.bio, u2.bio) as bio,
				COALESCE(u.pictures_urls, u2.pictures_urls) as pictures_urls,
				COALESCE(u.interests, u2.interests) as interests,
				COALESCE(u.location, u2.location) as location,
				COALESCE(u.fame_score, u2.fame_score) as fame_score,
				COALESCE(u.created_at, u2.created_at) as user_created_at,
				COALESCE(u.updated_at, u2.updated_at) as user_updated_at,
				COALESCE(u.deleted_at, u2.deleted_at) as user_deleted_at,
				msg.id as last_message_id,
				msg.sender_id as last_message_sender_id,
				msg.match_id as last_message_match_id,
				msg.type as last_message_type,
				msg.content as last_message_content,
				msg.status as last_message_status,
				msg.received_at as last_message_received_at,
				msg.read_at as last_message_read_at,
				msg.created_at as last_message_created_at,
				msg.updated_at as last_message_updated_at,
				msg.deleted_at as last_message_deleted_at
			FROM matches m
			LEFT JOIN users u ON u.id = m.user2_id AND m.user1_id = ${userId}
			LEFT JOIN users u2 ON u2.id = m.user1_id AND m.user2_id = ${userId}
			LEFT JOIN LATERAL (
				SELECT 
					id, 
					sender_id, 
					match_id, 
					type,
					content, 
					status,
					received_at,
					read_at,
					created_at, 
					updated_at, 
					deleted_at
				FROM messages
				WHERE match_id = m.id AND deleted_at IS NULL
				ORDER BY created_at DESC
				LIMIT 1
			) msg ON true
			WHERE (m.user1_id = ${userId} OR m.user2_id = ${userId})
				AND m.deleted_at IS NULL
				AND (u.deleted_at IS NULL OR u2.deleted_at IS NULL)
				${unreadFilter}
			ORDER BY COALESCE(msg.created_at, m.created_at) DESC
			LIMIT ${limit} OFFSET ${offset}
		`;
	}

	private mapRowToMatchWithDetails(
		row: any,
		userId: number,
	): MatchWithDetails {
		return {
			...this.mapRowToMatch(row),
			other_user: this.mapRowToUser(row),
			last_message: this.mapRowToMessage(row),
			unread_messages_count: this.getUnreadCount(row, userId),
		};
	}

	private mapRowToMatch(row: any): Match {
		return {
			id: row.id,
			user1_id: row.user1_id,
			user2_id: row.user2_id,
			unread_messages_count_user1: row.unread_messages_count_user1,
			unread_messages_count_user2: row.unread_messages_count_user2,
			created_at: row.created_at,
			updated_at: row.updated_at,
			deleted_at: row.deleted_at,
		};
	}

	private mapRowToUser(row: any): User {
		return {
			id: row.user_id,
			first_name: row.first_name,
			last_name: row.last_name,
			gender: row.gender,
			orientation: row.orientation,
			age: row.age,
			bio: row.bio,
			pictures_urls: row.pictures_urls,
			interests: row.interests,
			location: row.location,
			fame_score: row.fame_score,
			created_at: row.user_created_at,
			updated_at: row.user_updated_at,
			deleted_at: row.user_deleted_at,
		};
	}

	private mapRowToMessage(row: any): Message | null {
		if (!row.last_message_id) return null;

		return {
			id: row.last_message_id,
			sender_id: row.last_message_sender_id,
			match_id: row.last_message_match_id,
			type: row.last_message_type,
			content: row.last_message_content,
			status: row.last_message_status,
			received_at: row.last_message_received_at,
			read_at: row.last_message_read_at,
			created_at: row.last_message_created_at,
			updated_at: row.last_message_updated_at,
			deleted_at: row.last_message_deleted_at,
		};
	}

	private getUnreadCount(row: any, userId: number): number {
		return row.user1_id === userId
			? row.unread_messages_count_user1
			: row.unread_messages_count_user2;
	}

	public async countMatches(
		userId: number,
		unreadOnly: boolean,
	): Promise<number> {
		try {
			const unreadFilter = unreadOnly
				? `AND ((m.user1_id = ${userId} AND m.unread_messages_count_user1 > 0) OR (m.user2_id = ${userId} AND m.unread_messages_count_user2 > 0))`
				: "";

			const query = `
				SELECT COUNT(*) as count
				FROM matches m
				WHERE (m.user1_id = ${userId} OR m.user2_id = ${userId})
					AND m.deleted_at IS NULL
					${unreadFilter}
			`;

			const [rows] = await this.executeQuery<any>(query, []);
			return rows[0].count;
		} catch (error) {
			logger.error("Error counting matches:", error);
			throw error;
		}
	}
}
