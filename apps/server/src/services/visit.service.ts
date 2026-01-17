import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { VisitRepository } from "@/repositories/visit.repository";
import {
	CreateVisitDto,
	PaginatedResponse,
	StatusCodes,
	VisitWithUser,
	logger,
} from "@matcha/shared";
import { emptyPaginatedResponse } from "@/utils/pagination.utils";

export class VisitService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get visitRepository(): VisitRepository {
		return this.container.get<VisitRepository>(ETokens.VisitRepository);
	}

	public async createVisit(
		visitorId: number,
		data: CreateVisitDto
	): Promise<ServiceResponse> {
		try {
			const { visited_id } = data;

			if (visitorId === visited_id) {
				return ServiceResponse.failure(
					"Cannot visit yourself",
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const lastVisit = await this.visitRepository.getLastVisit(
				visitorId
			);

			if (lastVisit?.visited_id === visited_id) {
				return ServiceResponse.success("Visit already recorded", null);
			}

			const visit = await this.visitRepository.createVisit(
				visitorId,
				visited_id
			);

			if (!visit) {
				return ServiceResponse.failure(
					"Failed to record visit",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR
				);
			}

			return ServiceResponse.success("Visit recorded", null);
		} catch (error) {
			logger.error("Error in createVisit:", error);
			return ServiceResponse.failure(
				"An error occurred while recording visit",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	public async getVisitsReceived(
		userId: number,
		page: number,
		limit: number
	): Promise<ServiceResponse<PaginatedResponse<VisitWithUser>>> {
		try {
			const { visits, total } =
				await this.visitRepository.getVisitsReceived(
					userId,
					page,
					limit
				);

			const totalPages = Math.ceil(total / limit);

			const response: PaginatedResponse<VisitWithUser> = {
				data: visits,
				meta: {
					total,
					page,
					limit,
					totalPages,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
			};

			return ServiceResponse.success(
				"Visits retrieved successfully",
				response
			);
		} catch (error) {
			logger.error("Error in getVisitsReceived:", error);
			return ServiceResponse.failure<PaginatedResponse<VisitWithUser>>(
				"An error occurred while retrieving visits",
				emptyPaginatedResponse<VisitWithUser>(limit),
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}
