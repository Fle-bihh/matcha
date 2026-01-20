import { ERouteGroups, getRoute } from "@matcha/shared";
import type {
	PaginatedResponse,
	MatchWithDetails,
	GetMatchesResponseDto,
	MatchesParams,
	User,
} from "@matcha/shared";
import { EEntityTypes, ServiceResponse, StoreMatch } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { EPagerKeys } from "@/constants";
import { patchEntity, setEntities } from "@/store";
import { StoreMessage } from "@/types/message.types";

export class MatchService extends BaseService {
	async handleMatchWithDetails(match: MatchWithDetails): Promise<void> {
		const { last_message, other_user, ...matchData } = match;

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
				entity: {
					...other_user,
					is_matched: true,
					has_liked_you: true,
					is_liked: true,
				},
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
		const messages: StoreMessage[] = [];

		response.data.data.forEach((match) => {
			const { other_user, last_message, ...matchData } = match;
			otherUsers.push(other_user);
			matches.push(matchData);
			if (last_message) {
				messages.push(last_message);
			}
		});

		this.handlePaginatedResponse(
			{ data: matches, meta: response.data.meta },
			EPagerKeys.Matches,
			EEntityTypes.Matches,
			params?.refresh !== true,
			params?.refresh === true,
		);

		this.dispatch(
			setEntities({
				entityType: EEntityTypes.Users,
				entities: otherUsers,
			}),
		);

		this.dispatch(
			setEntities({
				entityType: EEntityTypes.Messages,
				entities: messages,
			}),
		);

		return ServiceResponse.success(response.message);
	}
}
