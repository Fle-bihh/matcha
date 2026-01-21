import { ETokens, IContainer, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { NotificationRepository } from "@/repositories";
import {
	GetNotificationsResponseDto,
	logger,
	Notification,
	PaginationParams,
	StatusCodes,
	WebSocketEvents,
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

	public async createUserNotification(
		userId: number,
		content: string,
	): Promise<ServiceResponse<Notification | null>> {
		try {
			const notification =
				await this.notificationRepository.createNotification(
					userId,
					content,
				);

			if (!notification) {
				return ServiceResponse.failure(
					"Failed to create notification",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success(
				"Notification sent successfully",
				notification,
			);
		} catch (error) {
			logger.error("Error creating user notification:", error);
			return ServiceResponse.failure(
				"An error occurred while sending the notification",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
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

			return ServiceResponse.success(
				"Notifications retrieved successfully",
				{
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
				},
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
