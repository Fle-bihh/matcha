import { GetHealthRequestDto, GetHealthResponseDto } from "@/dto";
import { IContainer, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";

export class HealthService extends BaseService {
	private startTime = Date.now();

	constructor(container: IContainer) {
		super(container);
	}

	public getHealthStatus(
		dto: GetHealthRequestDto
	): ServiceResponse<GetHealthResponseDto> {
		const { include_details: includeDetails = false } = dto;
		const baseStatus = {
			status: "healthy",
			timestamp: new Date().toISOString(),
			service: "HealthService",
		};

		if (includeDetails) {
			return ServiceResponse.success("Health status with details", {
				...baseStatus,
				uptime: Date.now() - this.startTime,
				details: {
					memory_usage: process.memoryUsage(),
					cpu_usage: process.cpuUsage().user / 1000000,
				},
			});
		}

		return ServiceResponse.success("Basic health status", baseStatus);
	}
}
