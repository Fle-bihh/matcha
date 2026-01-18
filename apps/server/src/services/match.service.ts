import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import {
	GetMatchesResponseDto,
	logger,
	Match,
	MatchesFilterDto,
	MatchWithDetails,
	PaginatedResponse,
	PaginationParams,
	StatusCodes,
} from "@matcha/shared";
import { MatchRepository } from "@/repositories";
import { ETokens } from "@/types/container.types";
import { IContainer } from "@/types";
import { emptyPaginatedResponse } from "@/utils/pagination.utils";

export class MatchService extends BaseService {
	private matchRepository: MatchRepository;

	constructor(container: IContainer) {
		super(container);
		this.matchRepository = this.container.get<MatchRepository>(
			ETokens.MatchRepository,
		);
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
			const unreadOnly = filters.unread_only ?? false;
			const offset = (pagination.page - 1) * pagination.limit;

			const [matches, totalCount] = await Promise.all([
				this.matchRepository.getMatchesWithDetails(
					userId,
					pagination.limit,
					offset,
					unreadOnly,
				),
				this.matchRepository.countMatches(userId, unreadOnly),
			]);

			const unreadCount = await this.matchRepository.countMatches(
				userId,
				true,
			);

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
					totalPages,
					hasNextPage: pagination.page < totalPages,
					hasPreviousPage: pagination.page > 1,
				},
				extraData: {
					unread_conversations_count: unreadCount,
				},
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
