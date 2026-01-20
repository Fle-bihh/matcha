import { ERouteGroups, getRoute } from "@matcha/shared";
import type {
	CreateBlockDto,
	CreateBlockResponseDto,
	CreateReportDto,
	CreateReportResponseDto,
} from "@matcha/shared";
import { EEntityTypes, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { patchEntity } from "@/store";

export class BlockService extends BaseService {
	@action({ showSuccessMessage: true, showErrorMessage: true })
	async createBlock(dto: CreateBlockDto): Promise<ServiceResponse> {
		const response = await this.apiService.post<CreateBlockResponseDto>(
			getRoute(ERouteGroups.Block, "block"),
			dto,
			{ auth: true },
		);

		if (this.isSuccess(response)) {
			this.dispatch(
				patchEntity({
					entityType: EEntityTypes.Users,
					entity: { is_blocked: true },
					id: dto.blocked_id.toString(),
				}),
			);
			this.router.goBack();
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}
}
