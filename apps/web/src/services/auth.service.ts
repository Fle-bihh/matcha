import {
	ApiResponse,
	logger,
	RegisterRequestDto,
	RegisterResponseDto,
} from "@matcha/shared";
import { BaseService } from "./base.service";
import { API_ROUTES } from "@/constants";
import { ServiceResponse } from "@/types";

export class AuthService extends BaseService {
	async register(data: RegisterRequestDto): Promise<ServiceResponse<{}>> {
		const response = await this.apiService.post<
			ApiResponse<RegisterResponseDto>
		>(API_ROUTES.register, data);

		logger.debug("AuthService.register", response);
		return ServiceResponse.success(response.responseObject);
	}
}
