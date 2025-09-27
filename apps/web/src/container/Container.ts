import { ETokens, IContainer } from "@/types/container.types";
import { ApiService, UserService } from "@/services";
import { Store } from "@reduxjs/toolkit";
import { TAppDispatch, TRootState } from "@/types/store.types";
import { createStore } from "@/store";

type ServiceConstructor = new (container: IContainer) => any;

const services: Record<ETokens, ServiceConstructor> = {
	[ETokens.ApiService]: ApiService,
	[ETokens.UserService]: UserService,
} as const;

export class Container implements IContainer {
	private readonly instances = new Map<ETokens, any>();
	public readonly store: Store<TRootState, any> & { dispatch: TAppDispatch };

	constructor() {
		this.store = createStore(this) as Store<TRootState, any> & {
			dispatch: TAppDispatch;
		};
	}

	public get<T>(token: ETokens): T {
		return (
			this.instances.get(token) ??
			this.instances.set(token, new services[token](this)).get(token)!
		);
	}
}
