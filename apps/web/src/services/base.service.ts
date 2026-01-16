import { EEntityTypes, ETokens, IContainer } from "@/types";
import { ApiService } from "./api.service";
import { StorageService } from "./storage.service";
import { AuthService } from "./auth.service";
import { RouterService } from "./router.service";
import { SnackbarService } from "./snackbar.service";
import { LocationService } from "./location.service";
import {
	appendToPager,
	setEntities,
	setFlagger,
	SetFlaggerPayload,
	setPager,
} from "@/store";
import { ApiResponse, BaseEntity, PaginatedResponse } from "@matcha/shared";
import { ApiRequestResponse } from "@/types/api.types";
import { EPagerKeys } from "@/constants";

export abstract class BaseService {
	protected container: IContainer;

	constructor(container: IContainer) {
		this.container = container;
	}

	protected get dispatch() {
		return this.container.store.dispatch;
	}

	protected get apiService(): ApiService {
		return this.container.get<ApiService>(ETokens.ApiService);
	}

	protected get storageService(): StorageService {
		return this.container.get<StorageService>(ETokens.StorageService);
	}

	protected get authService(): AuthService {
		return this.container.get<AuthService>(ETokens.AuthService);
	}

	protected get router(): RouterService {
		return this.container.get<RouterService>(ETokens.RouterService);
	}

	protected get snackbar(): SnackbarService {
		return this.container.get<SnackbarService>(ETokens.SnackbarService);
	}

	protected get locationService(): LocationService {
		return this.container.get<LocationService>(ETokens.LocationService);
	}

	protected setFlagger(payload: SetFlaggerPayload) {
		this.dispatch(setFlagger(payload));
	}

	protected isSuccess<T>(response: ApiRequestResponse<T>): boolean {
		return response.status >= 200 && response.status < 300;
	}

	protected handlePaginatedResponse<T extends BaseEntity>(
		response: PaginatedResponse<T>,
		pagerKey: EPagerKeys,
		entityType: EEntityTypes,
		append?: boolean
	) {
		const { data, meta } = response;

		this.dispatch(
			setEntities({
				entityType,
				entities: data,
			})
		);

		const entityKeys = data.map((entity) => String(entity.id));
		const pagerAction = append ? appendToPager : setPager;
		this.dispatch(
			pagerAction({
				pagerKey,
				meta,
				entityKeys,
			})
		);
	}
}
