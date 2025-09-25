import { ETokens, IContainer } from "@/types/container";
import { ApiService, UserService } from "@/services";

type ServiceConstructor = new (container: IContainer) => any;

const services: Record<ETokens, ServiceConstructor> = {
	[ETokens.ApiService]: ApiService,
	[ETokens.UserService]: UserService,
} as const;

export class Container implements IContainer {
	private readonly instances = new Map<ETokens, any>();

	public get<T>(token: ETokens): T {
		return (
			this.instances.get(token) ??
			this.instances.set(token, new services[token](this)).get(token)!
		);
	}
}
