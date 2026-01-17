import { ERouteGroups, getRoute } from "@matcha/shared";
import type {
	PaginatedResponse,
	User,
	BrowsingParams,
	BrowsingFilters,
	AuthUser,
} from "@matcha/shared";
import { ServiceResponse } from "@/types";
import { BaseService } from "./base.service";
import { action } from "@/decorators";
import { setFilters, clearFilters } from "@/store/slices/filters.slice";
import { EPagerKeys } from "@/constants";
import { EEntityTypes, ETokens } from "@/types";
import { EFilterKeys } from "@/types/filters.types";
import { EStorageKeys } from "@/types/storage.constants";
import { StorageService } from "./storage.service";

const FILTER_KEY = EFilterKeys.Browsing;

export class BrowsingService extends BaseService {
	private async updateBrowsingFilters(
		filters: BrowsingFilters
	): Promise<ServiceResponse> {
		this.dispatch(setFilters({ key: FILTER_KEY, filters }));
		await this.storageService.setItem(
			EStorageKeys.BrowsingFilters,
			filters
		);

		return ServiceResponse.success("Filters updated");
	}

	async loadBrowsingFilters(): Promise<ServiceResponse> {
		const savedFilters = await this.storageService.getItem(
			EStorageKeys.BrowsingFilters
		);

		if (savedFilters) {
			this.dispatch(
				setFilters({ key: FILTER_KEY, filters: savedFilters })
			);
			this.resetBrowsing(savedFilters);
			return ServiceResponse.success("Filters loaded");
		}

		this.resetBrowsing();
		return ServiceResponse.success("No saved filters");
	}

	@action({ showErrorMessage: false, showSuccessMessage: false })
	async clearBrowsingFilters(): Promise<ServiceResponse> {
		this.dispatch(clearFilters(FILTER_KEY));

		await this.storageService.removeItem(EStorageKeys.BrowsingFilters);

		await this.resetBrowsing({});

		return ServiceResponse.success("Filters cleared");
	}

	@action({ showErrorMessage: false, showSuccessMessage: false })
	async getUsers(params: BrowsingParams): Promise<ServiceResponse> {
		const response = await this.apiService.get<PaginatedResponse<User>>(
			getRoute(ERouteGroups.User, "get-users"),
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

	@action({ showErrorMessage: false, showSuccessMessage: false })
	async applyBrowsingFilters(
		filters: BrowsingFilters & {
			currentLimit: number;
		}
	): Promise<ServiceResponse> {
		const { currentLimit, ...rest } = filters;
		await this.updateBrowsingFilters({
			...rest,
		});

		await this.getUsers({
			page: 1,
			limit: currentLimit,
			refresh: true,
			...rest,
		});

		return ServiceResponse.success("Filters applied");
	}

	public async resetBrowsing(filters?: BrowsingFilters) {
		const filtersToApply =
			filters || this.container.store.getState().filters?.browsing || {};
		const pager = this.container.store.getState().pagers?.users;
		const currentLimit = pager?.meta?.limit ?? 12;
		await this.getUsers({
			page: 1,
			limit: currentLimit,
			refresh: true,
			...filtersToApply,
		});
	}
}
