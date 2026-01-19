import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { LikeRepository } from "@/repositories";
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

	private get likeRepository(): LikeRepository {
		return this.container.get<LikeRepository>(ETokens.LikeRepository);
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

	public async deleteAllLikesBetweenUsers(
		userAId: number,
		userBId: number,
		emitWebSocketEvents: boolean = false,
	): Promise<ServiceResponse> {
		try {
			const [likeAtoB, likeBtoA] = await Promise.all([
				this.likeRepository.getLikeByUsers(userAId, userBId),
				this.likeRepository.getLikeByUsers(userBId, userAId),
			]);

			const existingMatchRes = await this.matchService.getMatchByUsers(
				userAId,
				userBId,
			);

			if (this.isSuccess(existingMatchRes) && existingMatchRes.data) {
				const existingMatch = existingMatchRes.data;

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

				if (emitWebSocketEvents) {
					this.webSocketService.emitToUser(
						userAId,
						EWebSocketEvents.MatchDeleted,
						{
							match_id: existingMatch.id,
						},
					);
					this.webSocketService.emitToUser(
						userBId,
						EWebSocketEvents.MatchDeleted,
						{
							match_id: existingMatch.id,
							unlike_id: userAId,
							message: "The user has unliked you, match deleted.",
						},
					);
				}
			}

			const deletions = await Promise.all([
				likeAtoB ? this.likeRepository.deleteLike(likeAtoB.id) : true,
				likeBtoA ? this.likeRepository.deleteLike(likeBtoA.id) : true,
			]);

			if (deletions.some((deleted) => !deleted)) {
				return ServiceResponse.failure(
					"Failed to delete likes",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success(
				"Likes and matches deleted successfully",
				null,
				StatusCodes.OK,
			);
		} catch (error) {
			logger.error("Error in deleteAllLikesBetweenUsers:", error);
			return ServiceResponse.failure(
				"An error occurred while deleting likes and matches",
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

			return await this.deleteAllLikesBetweenUsers(
				likerId,
				likedId,
				true,
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
