import { ERouteGroups, getRoute } from "@matcha/shared";
import type {
	CreateVisitDto,
	PaginatedResponse,
	VisitWithVisitedUser,
	VisitsMadeResponseDto,
	BaseEntity,
} from "@matcha/shared";
import { ServiceResponse, EEntityTypes } from "@/types";
import type { PaginationDto } from "@/types/api.types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { EPagerKeys } from "@/constants";

type VisitEntity = VisitWithVisitedUser & Pick<BaseEntity, "updated_at">;

export class VisitService extends BaseService {
	@action({ showSuccessMessage: false, showErrorMessage: true })
	async createVisit(dto: CreateVisitDto): Promise<ServiceResponse> {
		const response = await this.apiService.post<void>(
			getRoute(ERouteGroups.Visit, "create-visit"),
			dto,
			{ auth: true }
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
			{ auth: true, params }
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		const visitData = response.data;

		this.handlePaginatedResponse<VisitEntity>(
			{
				data: visitData.visitsMade.data as VisitEntity[],
				meta: visitData.visitsMade.meta,
			},
			EPagerKeys.Visits,
			EEntityTypes.Visits,
			params?.refresh !== true
		);

		return ServiceResponse.success(response.message);
	}
}
