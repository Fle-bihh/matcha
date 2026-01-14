import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { LikeRepository } from "@/repositories/like.repository";
import {
	Like,
	CreateLikeDto,
	logger,
	CreateLikeResponseDto,
} from "@matcha/shared";
import { StatusCodes } from "@matcha/shared";

export class LikeService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get likeRepository(): LikeRepository {
		return this.container.get<LikeRepository>(ETokens.LikeRepository);
	}

	public async createLike(
		likerId: number,
		data: CreateLikeDto
	): Promise<ServiceResponse<CreateLikeResponseDto | null>> {
		try {
			const { liked_id } = data;

			if (likerId === liked_id) {
				return ServiceResponse.failure(
					"Cannot like yourself",
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const existingLike = await this.likeRepository.getLikeByUsers(
				likerId,
				liked_id
			);

			if (existingLike) {
				return ServiceResponse.failure(
					"You already liked this user",
					null,
					StatusCodes.CONFLICT
				);
			}

			const like = await this.likeRepository.createLike(
				likerId,
				liked_id
			);

			if (!like) {
				return ServiceResponse.failure(
					"Failed to create like",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}

			return ServiceResponse.success("User liked successfully", {
				isMatch: false,
			});
		} catch (error) {
			logger.error("Error in createLike service:", error);
			return ServiceResponse.failure(
				"Failed to create like",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}
