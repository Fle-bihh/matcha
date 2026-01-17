import { AuthUser, ERouteGroups, getRoute } from "@matcha/shared";
import type {
	UpdateProfileDto,
	UpdateProfilePictureDto,
	UpdateLocationDto,
	User,
} from "@matcha/shared";
import { EEntityTypes, ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { resetLocationState, setAuthUser, setEntity } from "@/store";
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

	private maybeResetBrowsing(user: AuthUser) {
		if (user.is_profile_complete) {
			this.browsingService.resetBrowsing();
		}
	}

	@action({ showSuccessMessage: true, showErrorMessage: true })
	async updateProfile(dto: UpdateProfileDto): Promise<ServiceResponse> {
		const response = await this.apiService.patch<AuthUser>(
			getRoute(ERouteGroups.User, "update-profile"),
			dto,
			{ auth: true },
		);

		if (this.isSuccess(response)) {
			this.setAuthUser(response.data);
			this.maybeResetBrowsing(response.data);
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}

	@action({ showSuccessMessage: true, showErrorMessage: true })
	async updateProfilePicture(
		dto: UpdateProfilePictureDto,
	): Promise<ServiceResponse> {
		const response = await this.apiService.patch<AuthUser>(
			getRoute(ERouteGroups.User, "update-profile-picture"),
			{
				picture: dto.file,
				index: dto.index,
			},
			{ auth: true, formData: true },
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
			getRoute(ERouteGroups.User, "update-location"),
			dto,
			{ auth: true },
		);

		if (this.isSuccess(response)) {
			this.setAuthUser(response.data);
			this.dispatch(resetLocationState());
			this.setFlagger({
				key: EFlaggers.ChangeLocationDialog,
				value: { isOpen: false },
			});
			this.maybeResetBrowsing(response.data);
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}

	@action({ showErrorMessage: true })
	async getUserById(userId: string): Promise<ServiceResponse> {
		const response = await this.apiService.get<User>(
			`${getRoute(ERouteGroups.User, "get-user-by-id").replace(
				":id",
				userId,
			)}`,
			{ auth: true },
		);

		if (this.isSuccess(response)) {
			this.dispatch(
				setEntity({
					entityType: EEntityTypes.Users,
					id: userId,
					entity: response.data,
				}),
			);
			return ServiceResponse.success(response.message);
		} else {
			return ServiceResponse.failure(response.message);
		}
	}
}
