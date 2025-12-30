import { AuthUser, getRoute } from "@matcha/shared";
import type {
  UpdateProfileDto,
  UpdateProfilePictureDto,
  UpdateLocationDto,
  PaginatedResponse,
  User,
  PaginationParams,
} from "@matcha/shared";
import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import {
  resetLocationState,
  setAuthUser,
  setEntities,
  setPager,
} from "@/store";
import { EFlaggers, EPagerKeys } from "@/constants";
import { EEntityTypes } from "@/types";

export class UserService extends BaseService {
  private setAuthUser(user: AuthUser) {
    this.dispatch(setAuthUser(user));
  }

  @action({ showSuccessMessage: true, showErrorMessage: true })
  async updateProfile(dto: UpdateProfileDto): Promise<ServiceResponse> {
    const response = await this.apiService.patch<AuthUser>(
      getRoute("user", "update-profile"),
      dto,
      { auth: true }
    );

    if (this.isSuccess(response)) {
      this.setAuthUser(response.data);
    } else {
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

    if (this.isSuccess(response)) {
      this.setAuthUser(response.data);
    } else {
      return ServiceResponse.failure(response.message);
    }

    return ServiceResponse.success(response.message);
  }

  @action({ showSuccessMessage: true, showErrorMessage: true })
  async updateLocation(dto: UpdateLocationDto): Promise<ServiceResponse> {
    const response = await this.apiService.patch<AuthUser>(
      getRoute("user", "update-location"),
      dto,
      { auth: true }
    );

    if (this.isSuccess(response)) {
      this.setAuthUser(response.data);
      this.dispatch(resetLocationState());
      this.setFlagger({
        key: EFlaggers.ChangeLocationDialog,
        value: { isOpen: false },
      });
    } else {
      return ServiceResponse.failure(response.message);
    }

    return ServiceResponse.success(response.message);
  }

  @action({ showErrorMessage: true, showSuccessMessage: true })
  async getUsers(params: PaginationParams | null): Promise<ServiceResponse> {
    const response = await this.apiService.get<PaginatedResponse<User>>(
      getRoute("user", "get-users"),
      { auth: true, params: params || undefined }
    );

    if (!this.isSuccess(response)) {
      return ServiceResponse.failure(response.message);
    }

    this.handlePaginatedResponse<User>(
      response.data,
      EPagerKeys.Users,
      EEntityTypes.Users
    );

    return ServiceResponse.success(response.message);
  }
}
