import { IRepository, TableSchema } from "@/types/repository.types";
import { BaseRepository } from "./base.repository";
import {
	UserStatus,
	EWebSocketEvents,
	EWebSocketChannels,
} from "@matcha/shared";
import { mysqlTimestamp } from "@/utils/date.utils";
import { ETokens } from "@/types";
import { WebSocketService } from "@/services";

export class UserStatusRepository
	extends BaseRepository
	implements IRepository
{
	private readonly collectionName = "user_status";
	public loadTableSchema(): TableSchema {
		return {
			tableName: this.collectionName,
			fields: `
				user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				is_online BOOLEAN NOT NULL DEFAULT FALSE,
				last_active_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
			`,
			constraints: "",
		};
	}

	private get WebSocketService(): WebSocketService {
		return this.container.get<WebSocketService>(ETokens.WebSocketService);
	}

	public async getUserStatus(userId: number): Promise<UserStatus | null> {
		const statuses = await this.getDocs<UserStatus>(this.collectionName, {
			where: "user_id = ?",
			values: [userId],
			limit: 1,
		});
		return statuses[0] || null;
	}

	private async updateUserStatus(
		userId: number,
		isOnline: boolean
	): Promise<void> {
		const existing = await this.getUserStatus(userId);
		const timestamp = mysqlTimestamp();

		if (existing) {
			await this.executeQuery(
				`UPDATE ${this.collectionName} SET is_online = ?, last_active_at = ? WHERE user_id = ?`,
				[isOnline, timestamp, userId]
			);
		} else {
			await this.createDocument<UserStatus>(this.collectionName, {
				user_id: userId,
				is_online: isOnline,
				last_active_at: timestamp,
			});
		}

		const updatedStatus = await this.getUserStatus(userId);
		if (updatedStatus) {
			this.emitStatusUpdate(userId, updatedStatus);
		}
	}

	private emitStatusUpdate(userId: number, status: UserStatus): void {
		const channel = EWebSocketChannels.UserStatus(userId);
		this.WebSocketService.emitToChannel(
			channel,
			EWebSocketEvents.UserStatusUpdate,
			{
				userId,
				status,
			}
		);
	}

	public async setUserOnline(userId: number): Promise<void> {
		await this.updateUserStatus(userId, true);
	}

	public async setUserOffline(userId: number): Promise<void> {
		await this.updateUserStatus(userId, false);
	}
}
