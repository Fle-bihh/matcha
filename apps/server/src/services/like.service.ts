import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { LikeRepository, MatchRepository } from "@/repositories";
import {
	CreateLikeDto,
	EWebSocketEvents,
	Like,
	StatusCodes,
	logger,
} from "@matcha/shared";

export class LikeService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	public async getLikingByUsers(
		userId: number,
		otherUserId: number,
	): Promise<{
		is_liked: boolean;
		has_liked_you: boolean;
		is_matched: boolean;
	}> {
		const isLiked = await this.likeRepository.checkLikeExists(
			userId,
			otherUserId,
		);

		const hasLikedYou = await this.likeRepository.checkLikeExists(
			otherUserId,
			userId,
		);

		return {
			is_liked: isLiked,
			has_liked_you: hasLikedYou,
			is_matched: isLiked && hasLikedYou,
		};
	}

	public async createLike(
		likerId: number,
		data: CreateLikeDto,
	): Promise<ServiceResponse> {
		try {
			const { liked_id } = data;

			const isBlocked = await this.blockService.checkBlockExists(
				likerId,
				liked_id,
			);

			if (isBlocked) {
				return ServiceResponse.failure(
					"Cannot like a user you have blocked or who has blocked you",
					null,
					StatusCodes.FORBIDDEN,
				);
			}

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
				const matchResponse = await this.matchService.createMatch(
					likerId,
					liked_id,
				);

				if (!this.isSuccess(matchResponse)) {
					await this.likeRepository.deleteLike(like.id);
					return ServiceResponse.failure(
						"Failed to create match after like",
						null,
						StatusCodes.INTERNAL_SERVER_ERROR,
					);
				}
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

			const existingMatchRes = await this.matchService.getMatchByUsers(
				likerId,
				likedId,
			);

			if (this.isSuccess(existingMatchRes) && existingMatchRes.data) {
				const existingMatch = existingMatchRes.data;
				const reverseLike = await this.likeRepository.getLikeByUsers(
					likedId,
					likerId,
				);

				const matchDeleted = await this.matchService.deleteMatchById(
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
