import { IContainer, ETokens, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { ReportRepository } from "@/repositories";
import { CreateReportDto, StatusCodes, logger } from "@matcha/shared";

export class ReportService extends BaseService {
	constructor(container: IContainer) {
		super(container);
	}

	private get reportRepository(): ReportRepository {
		return this.container.get<ReportRepository>(ETokens.ReportRepository);
	}

	public async createReport(
		reporterId: number,
		data: CreateReportDto,
	): Promise<ServiceResponse> {
		try {
			const { reported_id, reason } = data;

			if (reporterId === reported_id) {
				return ServiceResponse.failure(
					"You cannot report yourself",
					null,
					StatusCodes.BAD_REQUEST,
				);
			}

			const existingReport =
				await this.reportRepository.checkReportExists(
					reporterId,
					reported_id,
				);

			if (existingReport) {
				return ServiceResponse.failure(
					"You have already reported this user",
					null,
					StatusCodes.CONFLICT,
				);
			}

			const report = await this.reportRepository.createReport(
				reporterId,
				reported_id,
				reason,
			);

			if (!report) {
				return ServiceResponse.failure(
					"Failed to create report",
					null,
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return ServiceResponse.success(
				"Report created successfully",
				null,
				StatusCodes.CREATED,
			);
		} catch (error) {
			logger.error("Error in createReport:", error);
			return ServiceResponse.failure(
				"An error occurred while creating the report",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
