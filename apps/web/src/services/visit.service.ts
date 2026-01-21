import { ERouteGroups, getRoute } from "@matcha/shared";
import type { CreateVisitDto, VisitsMadeResponseDto } from "@matcha/shared";
import { EEntityTypes, ServiceResponse } from "@/types";
import type { PaginationDto } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { EPagerKeys } from "@/constants";
import { setReceivedCount } from "@/store";

export class VisitService extends BaseService {
	@action({ showSuccessMessage: false, showErrorMessage: true })
	async createVisit(dto: CreateVisitDto): Promise<ServiceResponse> {
		const response = await this.apiService.post<void>(
			getRoute(ERouteGroups.Visit, "create-visit"),
			dto,
			{ auth: true },
		);

		if (this.isSuccess(response)) {
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}

	@action({ showErrorMessage: false, showSuccessMessage: false })
	async getVisitsReceived(params: PaginationDto): Promise<ServiceResponse> {
		const response = await this.apiService.get<VisitsMadeResponseDto>(
			getRoute(ERouteGroups.Visit, "get-visits"),
			{ auth: true, params },
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		const visitData = response.data;

		this.handlePaginatedResponse(
			{
				data: visitData.visitsMade.data,
				meta: visitData.visitsMade.meta,
			},
			EPagerKeys.Visits,
			EEntityTypes.Visits,
			params?.refresh !== true,
		);

		this.container.store.dispatch(
			setReceivedCount(visitData.visitsReceivedCount),
		);

		return ServiceResponse.success(response.message);
	}
}
