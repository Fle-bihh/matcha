import { AuthUser, getRoute } from "@matcha/shared";
import type {
  UpdateProfileDto,
  UpdateProfilePictureDto,
  UpdateLocationDto,
  PaginatedResponse,
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

    if (response.success && response.responseObject) {
      this.setAuthUser(response.responseObject);
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
      this.setAuthUser(response.responseObject);
    }

    if (!response.success) {
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

    if (response.success && response.responseObject) {
      this.setAuthUser(response.responseObject);
      this.dispatch(resetLocationState());
      this.setFlagger({
        key: EFlaggers.ChangeLocationDialog,
        value: { isOpen: false },
      });
    }

    if (!response.success) {
      return ServiceResponse.failure(response.message);
    }

    return ServiceResponse.success(response.message);
  }

  @action({ showErrorMessage: true, showSuccessMessage: true })
  async getUsers(): Promise<ServiceResponse> {
    const response = await this.apiService.get<PaginatedResponse<AuthUser>>(
      getRoute("user", "get-users"),
      { auth: true }
    );

    if (!response.success || !response.responseObject) {
      return ServiceResponse.failure(response.message);
    }

    const { data, meta } = response.responseObject;

    this.dispatch(
      setEntities({
        entityType: EEntityTypes.Users,
        entities: data,
      })
    );

    const entityKeys = data.map((user) => String(user.id));
    this.dispatch(
      setPager({
        pagerKey: EPagerKeys.Users,
        meta,
        entityKeys,
      })
    );

    return ServiceResponse.success(response.message);
  }
}
