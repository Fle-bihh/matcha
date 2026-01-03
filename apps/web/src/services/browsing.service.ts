import { getRoute } from "@matcha/shared";
import type {
	PaginatedResponse,
	User,
	BrowsingParams,
	BrowsingFilters,
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
	@action({ showErrorMessage: false, showSuccessMessage: false })
	async loadBrowsingFilters(): Promise<ServiceResponse> {
		const savedFilters = await this.storageService.getItem(
			EStorageKeys.BrowsingFilters
		);

		if (savedFilters) {
			this.dispatch(
				setFilters({ key: FILTER_KEY, filters: savedFilters })
			);
			return ServiceResponse.success("Filters loaded");
		}

		return ServiceResponse.success("No saved filters");
	}

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

	@action({ showErrorMessage: false, showSuccessMessage: false })
	async clearBrowsingFilters(): Promise<ServiceResponse> {
		this.dispatch(clearFilters(FILTER_KEY));

		await this.storageService.removeItem(EStorageKeys.BrowsingFilters);

		return ServiceResponse.success("Filters cleared");
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

	@action({ showErrorMessage: false, showSuccessMessage: false })
	async applyBrowsingFilters(
		filters: BrowsingFilters & {
			currentLimit: number;
		}
	): Promise<ServiceResponse> {
		await this.updateBrowsingFilters(filters);

		await this.getUsers({
			page: 1,
			limit: filters.currentLimit,
			refresh: true,
			...filters,
		});

		return ServiceResponse.success("Filters applied");
	}
}
