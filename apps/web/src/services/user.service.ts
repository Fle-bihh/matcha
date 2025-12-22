import { AuthUser, getRoute } from "@matcha/shared";
import type { UpdateProfileDto } from "@matcha/shared";
import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { setAuthUser } from "@/store";

export class UserService extends BaseService {
  async getUsers(): Promise<ServiceResponse> {
    return ServiceResponse.failure("Not implemented");
  }

  @action()
  async updateProfile(data: UpdateProfileDto): Promise<ServiceResponse> {
    const response = await this.apiService.patch<AuthUser>(
      getRoute("user", "update-profile"),
      data,
      { auth: true }
    );

    if (response.success && response.responseObject) {
      this.dispatch(setAuthUser(response.responseObject));
    }

    if (!response.success) {
      return ServiceResponse.failure(response.message);
    }

    return ServiceResponse.success(response.message);
  }
}
