import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { LikeRepository } from "@/repositories/like.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { CreateLikeDto, logger, EWebSocketEvents, Like } from "@matcha/shared";
import { StatusCodes } from "@matcha/shared";

export class LikeService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get likeRepository(): LikeRepository {
		return this.container.get<LikeRepository>(ETokens.LikeRepository);
	}

	private get matchRepository(): MatchRepository {
		return this.container.get<MatchRepository>(ETokens.MatchRepository);
	}

	public async getLikingByUsers(
		userId: number,
		otherUserId: number,
	): Promise<{
		is_liked: boolean;
		has_liked_you: boolean;
		is_matched: boolean;
	}> {
		const is_liked = await this.likeRepository.checkLikeExists(
			userId,
			otherUserId,
		);

		const has_liked_you = await this.likeRepository.checkLikeExists(
			otherUserId,
			userId,
		);

		return {
			is_liked,
			has_liked_you,
			is_matched: is_liked && has_liked_you,
		};
	}

	public async createLike(
		likerId: number,
		data: CreateLikeDto,
	): Promise<ServiceResponse> {
		try {
			const { liked_id } = data;

			if (likerId === liked_id) {
				return ServiceResponse.failure(
					"Cannot like yourself",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			const existingLike = await this.likeRepository.getLikeByUsers(
				likerId,
				liked_id,
			);

			if (existingLike) {
				return ServiceResponse.failure(
					"You already liked this user",
					null,
					StatusCodes.CONFLICT,
				);
			}

			const like = await this.likeRepository.createLike(
				likerId,
				liked_id,
			);

			if (!like) {
				return ServiceResponse.failure(
					"Failed to create like",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			const isMatch = await this.likeRepository.checkReverseLikeExists(
				likerId,
				liked_id,
			);

			if (isMatch) {
				const match = await this.matchRepository.createMatch(
					likerId,
					liked_id,
				);

				if (!match) {
					await this.likeRepository.deleteLike(like.id);
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
						liked_id,
					);

				if (!matchDetailed || !otherUserMatchDetailed) {
					await this.matchRepository.deleteMatch(match.id);
					await this.likeRepository.deleteLike(like.id);
					return ServiceResponse.failure(
						"Failed to retrieve match details",
						null,
						StatusCodes.INTERNAL_SERVER_ERROR,
					);
				}

				this.webSocketService.emitToUser(
					likerId,
					EWebSocketEvents.MatchCreated,
					matchDetailed,
				);
				this.webSocketService.emitToUser(
					liked_id,
					EWebSocketEvents.MatchCreated,
					otherUserMatchDetailed,
				);
			}

			return ServiceResponse.success(
				"User liked successfully",
				null,
				StatusCodes.CREATED,
			);
		} catch (error) {
			logger.error("Error in createLike:", error);
			return ServiceResponse.failure(
				"An error occurred while creating the like",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async unlikeUser(
		likerId: number,
		likedId: number,
	): Promise<ServiceResponse> {
		try {
			const existingLike = await this.likeRepository.getLikeByUsers(
				likerId,
				likedId,
			);

			if (!existingLike) {
				return ServiceResponse.failure(
					"You have not liked this user",
					null,
					StatusCodes.NOT_FOUND,
				);
			}

			const existingMatch = await this.matchRepository.getMatchByUsers(
				likerId,
				likedId,
			);

			if (existingMatch) {
				const reverseLike = await this.likeRepository.getLikeByUsers(
					likedId,
					likerId,
				);

				const matchDeleted = await this.matchRepository.deleteMatch(
					existingMatch.id,
				);

				if (!matchDeleted) {
					return ServiceResponse.failure(
						"Failed to delete match",
						null,
						StatusCodes.INTERNAL_SERVER_ERROR,
					);
				}

				if (reverseLike) {
					await this.likeRepository.deleteLike(reverseLike.id);
				}

				this.webSocketService.emitToUser(
					likerId,
					EWebSocketEvents.MatchDeleted,
					{
						match_id: existingMatch.id,
					},
				);
				this.webSocketService.emitToUser(
					likedId,
					EWebSocketEvents.MatchDeleted,
					{
						match_id: existingMatch.id,
						unlike_id: likerId,
						message: "The user has unliked you, match deleted.",
					},
				);
			}

			const deleted = await this.likeRepository.deleteLike(
				existingLike.id,
			);

			if (!deleted) {
				return ServiceResponse.failure(
					"Failed to unlike user",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success(
				"User unliked successfully",
				null,
				StatusCodes.OK,
			);
		} catch (error) {
			logger.error("Error in unlikeUser:", error);
			return ServiceResponse.failure(
				"An error occurred while unliking the user",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
