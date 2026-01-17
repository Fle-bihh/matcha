import { IRepository, TableSchema } from "@/types/repository.types";
import { BaseRepository } from "./base.repository";
import { UserStatus } from "@matcha/shared";
import { mysqlTimestamp } from "@/utils/date.utils";

export class UserStatusRepository
	extends BaseRepository
	implements IRepository
{
	private readonly collectionName = "user_status";
	public loadTableSchema(): TableSchema {
		return {
			tableName: this.collectionName,
			fields: "",
			constraints: "",
		};
	}

	public async getUserStatus(userId: number): Promise<UserStatus | null> {
		const status = await this.getDoc<UserStatus>(
			this.collectionName,
			userId
		);
		return status;
	}

	public async setUserOnline(userId: number): Promise<void> {
		await this.updateDoc<UserStatus>(this.collectionName, userId, {
			is_online: true,
			last_active_at: mysqlTimestamp(),
		});
	}

	public async setUserOffline(userId: number): Promise<void> {
		await this.updateDoc<UserStatus>(this.collectionName, userId, {
			is_online: false,
			last_active_at: mysqlTimestamp(),
		});
	}
}
