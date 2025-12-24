import { AuthUser, getRoute } from "@matcha/shared";
import type { UpdateProfileDto, UpdateProfilePictureDto } from "@matcha/shared";
import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { setAuthUser } from "@/store";

export class UserService extends BaseService {
  async getUsers(): Promise<ServiceResponse> {
    return ServiceResponse.failure("Not implemented");
  }

  @action({ showSuccessMessage: true, showErrorMessage: true })
  async updateProfile(dto: UpdateProfileDto): Promise<ServiceResponse> {
    const response = await this.apiService.patch<AuthUser>(
      getRoute("user", "update-profile"),
      dto,
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

  @action({ showSuccessMessage: true, showErrorMessage: true })
  async updateProfilePicture(
    dto: UpdateProfilePictureDto
  ): Promise<ServiceResponse> {
    const response = await this.apiService.patch<AuthUser>(
      getRoute("user", "update-profile-picture"),
      {
        picture: dto.file,
        index: dto.index,
      },
      { auth: true, formData: true }
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
