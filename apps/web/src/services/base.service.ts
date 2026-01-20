import { EEntityTypes, ETokens, IContainer, IEntityTypeMap } from "@/types";
import { ApiService } from "./api.service";
import { StorageService } from "./storage.service";
import { AuthService } from "./auth.service";
import { RouterService } from "./router.service";
import { SnackbarService } from "./snackbar.service";
import { LocationService } from "./location.service";
import {
	appendToPager,
	setEntities,
	setEntitiesStrict,
	setFlagger,
	SetFlaggerPayload,
	setPager,
} from "@/store";
import { ApiResponse, BaseEntity, PaginatedResponse } from "@matcha/shared";
import { ApiRequestResponse } from "@/types";
import { EPagerKeys, TPagerKey } from "@/constants";
import { BrowsingService } from "./browsing.service";
import { MatchService } from "./match.service";
import { WebSocketService } from "./websocket.service";

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

	protected get browsingService(): BrowsingService {
		return this.container.get<BrowsingService>(ETokens.BrowsingService);
	}

	protected get matchService(): MatchService {
		return this.container.get<MatchService>(ETokens.MatchService);
	}

	protected get webSocketService(): WebSocketService {
		return this.container.get<WebSocketService>(ETokens.WebSocketService);
	}

	protected setFlagger(payload: SetFlaggerPayload) {
		this.dispatch(setFlagger(payload));
	}

	protected isSuccess<T>(response: ApiRequestResponse<T>): boolean {
		return response.status >= 200 && response.status < 300;
	}

	protected handlePaginatedResponse<T extends EEntityTypes>(
		response: PaginatedResponse<IEntityTypeMap[T]>,
		pagerKey: TPagerKey,
		entityType: T,
		append?: boolean,
		strict?: boolean,
	) {
		const { data, meta } = response;

		const entitiesAction = strict ? setEntitiesStrict : setEntities;
		this.dispatch(
			entitiesAction({
				entityType,
				entities: data,
			}),
		);

		const entityKeys = data.map((entity) => String(entity.id));
		const pagerAction = append ? appendToPager : setPager;
		this.dispatch(
			pagerAction({
				pagerKey,
				meta,
				entityKeys,
			}),
		);
	}
}
