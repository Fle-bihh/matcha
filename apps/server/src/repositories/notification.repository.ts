import { BaseRepository } from "./base.repository";
import {
	Notification,
	logger,
	NotificationType,
	NotificationDataMap,
} from "@matcha/shared";
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
                type VARCHAR(50) NOT NULL,
				data JSON NOT NULL
            `,
			constraints: ``,
		};
	}

	public async createNotification<T extends NotificationType>(
		userId: number,
		type: T,
		data: NotificationDataMap[T],
	): Promise<Notification> {
		const notification = await this.createDocument<Notification>(
			this.tableName,
			{
				user_id: userId,
				type,
				data,
			},
		);

		return notification;
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
