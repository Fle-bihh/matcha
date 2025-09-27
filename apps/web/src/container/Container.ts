import { ETokens, IContainer } from "@/types/container.types";
import { ApiService, UserService } from "@/services";
import { Store } from "@reduxjs/toolkit";
import { TAppDispatch, TReduxStore, TRootState } from "@/types/store.types";
import { createStore } from "@/store";

type ServiceConstructor = new (container: IContainer) => any;

const serviceConstructors: Record<ETokens, ServiceConstructor> = {
	[ETokens.ApiService]: ApiService,
	[ETokens.UserService]: UserService,
} as const;

export class Container implements IContainer {
	private readonly services = new Map<ETokens, any>();
	public readonly store: TReduxStore;

	constructor() {
		this.store = createStore(this) as Store<TRootState, any> & {
			dispatch: TAppDispatch;
		};
	}

	public get<T>(token: ETokens): T {
		return (
			this.services.get(token) ??
			this.services
				.set(token, new serviceConstructors[token](this))
				.get(token)
		);
	}
}
