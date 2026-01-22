import { ETokens, IContainer, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { NotificationRepository } from "@/repositories";
import {
	GetNotificationsResponseDto,
	logger,
	Notification,
	NotificationType,
	NotificationDataMap,
	PaginationParams,
	StatusCodes,
	WebSocketEvents,
	ReadNotificationsResponseDto,
} from "@matcha/shared";
import { emptyPaginatedResponse } from "@/utils";

export class NotificationService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get notificationRepository(): NotificationRepository {
		return this.container.get<NotificationRepository>(
			ETokens.NotificationRepository,
		);
	}

	public async createNotification<T extends NotificationType>(
		userId: number,
		type: T,
		data: NotificationDataMap[T],
	): Promise<Notification | null> {
		try {
			const notification =
				await this.notificationRepository.createNotification(
					userId,
					type,
					data,
				);

			return notification;
		} catch (error) {
			logger.error("Error creating notification:", error);
			return null;
		}
	}

	public async getNotifications(
		userId: number,
		pagination: PaginationParams,
	): Promise<ServiceResponse<GetNotificationsResponseDto>> {
		try {
			const { page, limit } = pagination;
			const offset = (page - 1) * limit;

			const { notifications, total } =
				await this.notificationRepository.getNotifications(
					userId,
					limit,
					offset,
				);

			const totalPages = Math.ceil(total / limit);

			const unreadNotificationsCount =
				await this.notificationRepository.countUnreadNotifications(
					userId,
				);

			return ServiceResponse.success(
				"Notifications retrieved successfully",
				{
					unread_count: unreadNotificationsCount,
					notifications: {
						data: notifications,
						meta: {
							page,
							limit,
							total,
							total_pages: totalPages,
							has_next_page: page < totalPages,
							has_previous_page: page > 1,
						},
					},
				},
			);
		} catch (error) {
			logger.error("Error fetching notifications:", error);
			return ServiceResponse.failure(
				"An error occurred while fetching notifications",
				{
					notifications: emptyPaginatedResponse<Notification>(
						pagination.limit,
					),
					unread_count: 0,
				},
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async readNotifications(
		userId: number,
	): Promise<ServiceResponse<ReadNotificationsResponseDto | null>> {
		try {
			const ids = await this.notificationRepository.markAllAsRead(userId);

			if (!ids)
				return ServiceResponse.failure(
					"Error marking notifications as read",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);

			return ServiceResponse.success("Notifications marked as read", {
				notifications_ids: ids,
			});
		} catch (error) {
			logger.error("Error marking notifications as read:", error);
			return ServiceResponse.failure(
				"An error occurred while marking notifications as read",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
