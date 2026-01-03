import { AuthUser, getRoute } from "@matcha/shared";
import type {
	UpdateProfileDto,
	UpdateProfilePictureDto,
	UpdateLocationDto,
} from "@matcha/shared";
import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { resetLocationState, setAuthUser } from "@/store";
import { EFlaggers } from "@/constants";
import { ETokens } from "@/types";
import { BrowsingService } from "./browsing.service";

export class UserService extends BaseService {
	private setAuthUser(user: AuthUser) {
		this.dispatch(setAuthUser(user));
	}

	private get browsingService(): BrowsingService {
		return this.container.get<BrowsingService>(ETokens.BrowsingService);
	}

	public async resetBrowsing(user?: AuthUser) {
		if (!user?.is_profile_complete) return;

		const filters = this.container.store.getState().filters?.browsing || {};
		const pager = this.container.store.getState().pagers?.users;
		const currentLimit = pager?.meta?.limit ?? 10;
		await this.browsingService.getUsers({
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
}
