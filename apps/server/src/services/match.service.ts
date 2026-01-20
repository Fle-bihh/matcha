import { ETokens, IContainer, ServiceResponse } from "@/types";
import { emptyPaginatedResponse } from "@/utils";
import { BaseService } from "./base.service";
import { MatchRepository } from "@/repositories";
import {
	EWebSocketEvents,
	GetMatchesResponseDto,
	logger,
	Match,
	MatchesFilterDto,
	MatchWithDetails,
	PaginatedResponse,
	PaginationParams,
	StatusCodes,
	SystemMessageType,
} from "@matcha/shared";

export class MatchService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get matchRepository(): MatchRepository {
		return this.container.get<MatchRepository>(ETokens.MatchRepository);
	}

	public async createMatch(
		likerId: number,
		likedId: number,
	): Promise<ServiceResponse> {
		try {
			const match = await this.matchRepository.createMatch(
				likerId,
				likedId,
			);

			if (!match) {
				return ServiceResponse.failure(
					"Failed to create match",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			const matchDetailed =
				await this.matchRepository.getMatchByIdWithDetails(
					match.id,
					likerId,
				);

			const otherUserMatchDetailed =
				await this.matchRepository.getMatchByIdWithDetails(
					match.id,
					likedId,
				);

			if (!matchDetailed || !otherUserMatchDetailed) {
				await this.matchRepository.deleteMatch(match.id);
				return ServiceResponse.failure(
					"Failed to retrieve match details",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			const lastMessage = await this.messageService.createSystemMessage(
				match.id,
				SystemMessageType.MatchStarted,
				{
					first_name_1: matchDetailed.other_user.first_name,
					first_name_2: otherUserMatchDetailed.other_user.first_name,
					started_at: match.created_at,
				},
			);

			this.webSocketService.emitToUser(
				likerId,
				EWebSocketEvents.MatchCreated,
				{ ...matchDetailed, last_message: lastMessage },
			);
			this.webSocketService.emitToUser(
				likedId,
				EWebSocketEvents.MatchCreated,
				{ ...otherUserMatchDetailed, last_message: lastMessage },
			);

			return ServiceResponse.success(
				"Match created successfully",
				null,
				StatusCodes.CREATED,
			);
		} catch (error) {
			logger.error("Error in createMatch:", error);
			return ServiceResponse.failure(
				"An error occurred while creating the match",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async deleteMatchById(matchId: number): Promise<boolean> {
		try {
			const deleted = await this.matchRepository.deleteMatch(matchId);
			return deleted;
		} catch (error) {
			logger.error("Error in deleteMatchById:", error);
			return false;
		}
	}

	public async getMatchByUsers(
		userAId: number,
		userBId: number,
	): Promise<ServiceResponse<Match | null>> {
		try {
			const match = await this.matchRepository.getMatchByUsers(
				userAId,
				userBId,
			);

			if (!match) {
				return ServiceResponse.failure(
					"Match not found",
					null,
					StatusCodes.NOT_FOUND,
				);
			}

			return ServiceResponse.success(
				"Match retrieved successfully",
				match,
				StatusCodes.OK,
			);
		} catch (error) {
			logger.error("Error in getMatchByUsers:", error);
			return ServiceResponse.failure(
				"An error occurred while retrieving the match",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async verifyUserInMatch(
		userId: number,
		matchId: number,
	): Promise<ServiceResponse<Match | null>> {
		try {
			const match = await this.matchRepository.getDoc<Match>(
				"matches",
				matchId,
			);

			if (!match) {
				return ServiceResponse.failure<Match | null>(
					"Match not found",
					null,
					StatusCodes.NOT_FOUND,
				);
			}

			if (match.user1_id !== userId && match.user2_id !== userId) {
				return ServiceResponse.failure<Match | null>(
					"You are not part of this match",
					null,
					StatusCodes.FORBIDDEN,
				);
			}

			return ServiceResponse.success<Match | null>(
				"User verified in match",
				match,
				StatusCodes.OK,
			);
		} catch (error) {
			logger.error("Error in verifyUserInMatch:", error);
			return ServiceResponse.failure<Match | null>(
				"An error occurred while verifying match access",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async getMatches(
		userId: number,
		pagination: PaginationParams,
		filters: MatchesFilterDto,
	): Promise<
		ServiceResponse<PaginatedResponse<
			MatchWithDetails,
			GetMatchesResponseDto
		> | null>
	> {
		try {
			const offset = (pagination.page - 1) * pagination.limit;

			const [matches, totalCount] = await Promise.all([
				this.matchRepository.getMatchesWithDetails(
					userId,
					pagination.limit,
					offset,
				),
				this.matchRepository.countMatches(userId),
			]);

			const totalPages = Math.ceil(totalCount / pagination.limit);

			const response: PaginatedResponse<
				MatchWithDetails,
				GetMatchesResponseDto
			> = {
				data: matches,
				meta: {
					page: pagination.page,
					limit: pagination.limit,
					total: totalCount,
					total_pages: totalPages,
					has_next_page: pagination.page < totalPages,
					has_previous_page: pagination.page > 1,
				},
				extra_data: {},
			};

			logger.info(
				`Retrieved ${
					matches.length
				} matches for user ID ${userId}. Details: ${JSON.stringify(
					response.data,
				)}`,
			);

			return ServiceResponse.success(
				"Matches retrieved successfully",
				response,
			);
		} catch (error) {
			return ServiceResponse.failure(
				"Failed to retrieve matches",
				emptyPaginatedResponse<MatchWithDetails, GetMatchesResponseDto>(
					pagination.limit,
				),
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
