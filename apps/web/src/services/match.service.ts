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

		if (last_message) {
			this.dispatch(
				patchEntity({
					entityType: EEntityTypes.Messages,
					id: last_message.id.toString(),
					entity: last_message,
				}),
			);
		}
	}

	private async handleMatchesWithDetails(
		matches: MatchWithDetails[],
	): Promise<void> {
		const otherUsers: User[] = [];
		const storeMatches: StoreMatch[] = [];
		const messages: StoreMessage[] = [];

		matches.forEach((match) => {
			const { other_user, last_message, ...matchData } = match;
			otherUsers.push(other_user);
			storeMatches.push(matchData);
			if (last_message) {
				messages.push(last_message);
			}
		});

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
	}

	@action({ showErrorMessage: false, showSuccessMessage: false })
	async getMatches(params: MatchesParams): Promise<ServiceResponse> {
		const response = await this.apiService.get<
			PaginatedResponse<MatchWithDetails, GetMatchesResponseDto>
		>(getRoute(ERouteGroups.Match, "get-matches"), { auth: true, params });

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		const matches = response.data.data;

		await this.handleMatchesWithDetails(matches);

		this.handlePaginatedResponse(
			{ data: matches, meta: response.data.meta },
			EPagerKeys.Matches,
			EEntityTypes.Matches,
			params?.refresh !== true,
			params?.refresh === true,
		);

		return ServiceResponse.success(response.message);
	}
}
