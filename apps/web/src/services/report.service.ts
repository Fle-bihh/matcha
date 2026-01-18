import { ERouteGroups, getRoute } from "@matcha/shared";
import type { CreateReportDto, CreateReportResponseDto } from "@matcha/shared";
import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";

export class ReportService extends BaseService {
	@action({ showSuccessMessage: true, showErrorMessage: true })
	async createReport(dto: CreateReportDto): Promise<ServiceResponse> {
		const response = await this.apiService.post<CreateReportResponseDto>(
			getRoute(ERouteGroups.Report, "report"),
			dto,
			{ auth: true },
		);

		if (this.isSuccess(response)) {
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}
}
