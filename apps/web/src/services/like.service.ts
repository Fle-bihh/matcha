import { getRoute, StatusCodes } from "@matcha/shared";
import type { CreateLikeDto, CreateLikeResponseDto } from "@matcha/shared";
import { EEntityTypes, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { patchEntity, setEntity } from "@/store";

export class LikeService extends BaseService {
	@action({ showSuccessMessage: true, showErrorMessage: true })
	async createLike(dto: CreateLikeDto): Promise<ServiceResponse> {
		const response = await this.apiService.post<CreateLikeResponseDto>(
			getRoute("like", "like"),
			dto,
			{ auth: true }
		);

		if (
			this.isSuccess(response) ||
			response.status === StatusCodes.CONFLICT
		) {
			this.dispatch(
				patchEntity({
					entityType: EEntityTypes.Users,
					id: dto.liked_id.toString(),
					entity: { isLiked: true },
				})
			);
		}

		if (this.isSuccess(response)) {
			if (response.data.isMatch && response.data.match) {
				this.dispatch(
					setEntity({
						entityType: EEntityTypes.Matches,
						id: response.data.match.id.toString(),
						entity: response.data.match,
					})
				);
			}
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}
}
