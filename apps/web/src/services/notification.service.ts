import { ERouteGroups, getRoute } from "@matcha/shared";
import type { GetNotificationsResponseDto } from "@matcha/shared";
import { EEntityTypes, ServiceResponse } from "@/types";
import type { PaginationDto } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { EPagerKeys } from "@/constants";

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

		this.handlePaginatedResponse(
			{
				data: response.data.notifications.data,
				meta: response.data.notifications.meta,
			},
			EPagerKeys.Notifications,
			EEntityTypes.Notifications,
			params?.refresh !== true,
		);

		return ServiceResponse.success(response.message);
	}
}
