import { BaseRepository } from "./base.repository";
import { Notification, logger } from "@matcha/shared";
import { IContainer, IRepository, TableSchema } from "@/types";

export class NotificationRepository
	extends BaseRepository
	implements IRepository
{
	private readonly tableName = "notifications";

	constructor(container: IContainer) {
		super(container);
	}

	public loadTableSchema(): TableSchema {
		return {
			tableName: this.tableName,
			fields: `
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL
            `,
			constraints: ``,
		};
	}

	public async createNotification(
		userId: number,
		content: string,
	): Promise<Notification | null> {
		try {
			return await this.createDocument<Notification>(this.tableName, {
				user_id: userId,
				content: content,
			});
		} catch (error) {
			logger.error("Error creating notification:", error);
			return null;
		}
	}

	public async getNotifications(
		userId: number,
		limit: number,
		offset: number,
	): Promise<{ notifications: Notification[]; total: number }> {
		try {
			const notifications = await this.getDocs<Notification>(
				this.tableName,
				{
					where: "user_id = ?",
					values: [userId],
					orderBy: "created_at DESC",
					limit,
					offset,
				},
			);

			const total = await this.countDocs(this.tableName, {
				where: "user_id = ?",
				values: [userId],
			});

			return { notifications, total };
		} catch (error) {
			logger.error("Error fetching notifications:", error);
			return { notifications: [], total: 0 };
		}
	}
}
