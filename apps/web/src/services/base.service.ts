import { ETokens, IContainer } from "@/types";
import { ApiService } from "./api.service";

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
}
