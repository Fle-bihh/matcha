import { ERouteGroups, getRoute } from "@matcha/shared";
import type {
	PaginatedResponse,
	MatchWithDetails,
	GetMatchesResponseDto,
	MatchesParams,
	User,
} from "@matcha/shared";
import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";
import { patchEntity, setEntities, setUnreadMatchesCount } from "@/store";
import { StoreMatch } from "@/types/match.types";

export class MatchService extends BaseService {
	async handleMatchWithDetails(match: MatchWithDetails): Promise<void> {
		const { other_user, ...matchData } = match;

		this.dispatch(
			patchEntity({
				entityType: EEntityTypes.Matches,
				id: matchData.id.toString(),
				entity: matchData,
			}),
		);

		this.dispatch(
			patchEntity({
				entityType: EEntityTypes.Users,
				id: other_user.id.toString(),
				entity: other_user,
			}),
		);
	}

	@action({ showErrorMessage: false, showSuccessMessage: false })
	async getMatches(params: MatchesParams): Promise<ServiceResponse> {
		const response = await this.apiService.get<
			PaginatedResponse<MatchWithDetails, GetMatchesResponseDto>
		>(getRoute(ERouteGroups.Match, "get-matches"), { auth: true, params });

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		const otherUsers: User[] = [];
		const matches: StoreMatch[] = [];

		response.data.data.forEach((match) => {
			const { other_user, ...matchData } = match;
			otherUsers.push(other_user);
			matches.push(matchData);
		});

		this.handlePaginatedResponse(
			{ data: matches, meta: response.data.meta },
			EPagerKeys.Matches,
			EEntityTypes.Matches,
			params?.refresh !== true,
		);

		this.dispatch(
			setEntities({
				entityType: EEntityTypes.Users,
				entities: otherUsers,
			}),
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
