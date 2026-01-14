import { getRoute } from "@matcha/shared";
import type { CreateLikeDto } from "@matcha/shared";
import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";

export class LikeService extends BaseService {
	@action({ showSuccessMessage: true, showErrorMessage: true })
	async createLike(dto: CreateLikeDto): Promise<ServiceResponse> {
		const response = await this.apiService.post(
			getRoute("like", "like"),
			dto,
			{ auth: true }
		);

		if (this.isSuccess(response)) {
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}
}
