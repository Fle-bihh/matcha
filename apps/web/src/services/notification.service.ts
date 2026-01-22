import { ERouteGroups, getRoute } from "@matcha/shared";
import type {
	GetNotificationsResponseDto,
	ReadNotificationsResponseDto,
} from "@matcha/shared";
import { EEntityTypes, ServiceResponse } from "@/types";
import type { PaginationDto } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { ECounterKeys, EPagerKeys } from "@/constants";
import { selectEntitiesByType, setCounter, setEntities } from "@/store";

export class NotificationService extends BaseService {
	@action({ showErrorMessage: false, showSuccessMessage: false })
	async getNotifications(params: PaginationDto): Promise<ServiceResponse> {
		const response = await this.apiService.get<GetNotificationsResponseDto>(
			getRoute(ERouteGroups.Notification, "get-notifications"),
			{ auth: true, params },
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		this.dispatch(
			setCounter({
				key: ECounterKeys.UnreadNotifications,
				value: response.data.unread_count,
			}),
		);

		this.handlePaginatedResponse(
			{
				data: response.data.notifications.data,
				meta: response.data.notifications.meta,
			},
			EPagerKeys.Notifications,
			EEntityTypes.Notifications,
			params?.refresh !== true,
			params.refresh === true,
		);

		return ServiceResponse.success(response.message);
	}

	private markNotificationsAsReadInState(notificationIds: number[]) {
		const state = this.container.store.getState();
		const existingNotifications = selectEntitiesByType(
			EEntityTypes.Notifications,
		)(state);
		this.dispatch(
			setEntities({
				entityType: EEntityTypes.Notifications,
				entities: Object.values(existingNotifications).map(
					(notification) => {
						if (notificationIds.includes(notification.id)) {
							return { ...notification, is_read: true };
						}
						return notification;
					},
				),
			}),
		);
		this.dispatch(
			setCounter({
				key: ECounterKeys.UnreadNotifications,
				value: 0,
			}),
		);
	}

	@action({ showErrorMessage: true, showSuccessMessage: true })
	async readNotifications(): Promise<ServiceResponse> {
		const response =
			await this.apiService.patch<ReadNotificationsResponseDto | null>(
				getRoute(ERouteGroups.Notification, "read-notifications"),
				{},
				{ auth: true },
			);

		if (!this.isSuccess(response) || !response.data?.notifications_ids) {
			console.error("Failed to mark notifications as read in service");
			return ServiceResponse.failure(response.message);
		}
		this.markNotificationsAsReadInState(response.data.notifications_ids);

		console.log("Notifications marked as read in service");
		return ServiceResponse.success(response.message);
	}
}
