import { RegisterRequestDto, RegisterResponseDto } from "@matcha/shared";
import { BaseService } from "./base.service";
import { API_ROUTES } from "@/constants";
import { ServiceResponse } from "@/types";
import { setAuthUser } from "@/store";

export class AuthService extends BaseService {
	async register(data: RegisterRequestDto): Promise<ServiceResponse<{}>> {
		const response = await this.apiService.post<RegisterResponseDto>(
			API_ROUTES.register,
			data
		);

		this.dispatch(setAuthUser(response.responseObject.user));
		return ServiceResponse.success(response.responseObject);
	}
}
