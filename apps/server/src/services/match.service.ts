import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import {
	GetMatchesResponseDto,
	MatchesFilterDto,
	PaginatedResponse,
	PaginationParams,
} from "@matcha/shared";

export class MatchService extends BaseService {
	public async getMatches(
		userId: number,
		pagination: PaginationParams,
		filters: MatchesFilterDto
	): Promise<
		ServiceResponse<PaginatedResponse<GetMatchesResponseDto> | null>
	> {
		// Implementation here
		return ServiceResponse.success("Matches retrieved successfully", null);
	}
}
