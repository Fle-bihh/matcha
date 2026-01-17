import { ERouteGroups, getRoute } from "@matcha/shared";
import type {
	PaginatedResponse,
	MatchWithDetails,
	GetMatchesResponseDto,
	MatchesParams,
} from "@matcha/shared";
import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import { setUnreadMatchesCount } from "@/store";

export class MatchService extends BaseService {
	@action({ showErrorMessage: false, showSuccessMessage: false })
	async getMatches(params: MatchesParams): Promise<ServiceResponse> {
		const response = await this.apiService.get<
			PaginatedResponse<MatchWithDetails, GetMatchesResponseDto>
		>(getRoute(ERouteGroups.Match, "get-matches"), { auth: true, params });

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		const { data, meta } = response.data;

		this.handlePaginatedResponse(
			{ data, meta },
			EPagerKeys.Matches,
			EEntityTypes.Matches,
			params?.refresh !== true,
		);

		if (response.data.extraData) {
			this.dispatch(
				setUnreadMatchesCount(
					response.data.extraData.unread_conversations_count,
				),
			);
		}

		return ServiceResponse.success(response.message);
	}
}
