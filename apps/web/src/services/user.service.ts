import { AuthUser, getRoute } from "@matcha/shared";
import type {
	UpdateProfileDto,
	UpdateProfilePictureDto,
	UpdateLocationDto,
	PaginatedResponse,
	User,
	BrowsingParams,
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
import { EFilterKeys } from "@/types/filters.types";

export class UserService extends BaseService {
	private setAuthUser(user: AuthUser) {
		this.dispatch(setAuthUser(user));
	}

	private resetBrowsing(user?: AuthUser) {
		if (!user?.is_profile_complete) return;
		const filters =
			this.container.store.getState().filters[EFilterKeys.Browsing];
		const pager = this.container.store.getState().pagers[EPagerKeys.Users];
		const currentLimit = pager.meta?.limit ?? 10;

		this.getUsers({
			page: 1,
			limit: currentLimit,
			refresh: true,
			...filters,
		});
	}

	@action({ showSuccessMessage: true, showErrorMessage: true })
	async updateProfile(dto: UpdateProfileDto): Promise<ServiceResponse> {
		const response = await this.apiService.patch<AuthUser>(
			getRoute("users", "update-profile"),
			dto,
			{ auth: true }
		);

		if (this.isSuccess(response)) {
			this.setAuthUser(response.data);
			this.resetBrowsing(response.data);
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}

	@action({ showSuccessMessage: true, showErrorMessage: true })
	async updateProfilePicture(
		dto: UpdateProfilePictureDto
	): Promise<ServiceResponse> {
		const response = await this.apiService.patch<AuthUser>(
			getRoute("users", "update-profile-picture"),
			{
				picture: dto.file,
				index: dto.index,
			},
			{ auth: true, formData: true }
		);

		if (this.isSuccess(response)) {
			this.setAuthUser(response.data);
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}

	@action({ showSuccessMessage: true, showErrorMessage: true })
	async updateLocation(dto: UpdateLocationDto): Promise<ServiceResponse> {
		const response = await this.apiService.patch<AuthUser>(
			getRoute("users", "update-location"),
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
			this.resetBrowsing(response.data);
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}

	@action({ showErrorMessage: false, showSuccessMessage: false })
	async getUsers(params: BrowsingParams): Promise<ServiceResponse> {
		const response = await this.apiService.get<PaginatedResponse<User>>(
			getRoute("users", "get-users"),
			{ auth: true, params }
		);

		if (!this.isSuccess(response)) {
			return ServiceResponse.failure(response.message);
		}

		this.handlePaginatedResponse<User>(
			response.data,
			EPagerKeys.Users,
			EEntityTypes.Users,
			params?.refresh !== true
		);

		return ServiceResponse.success(response.message);
	}
}
