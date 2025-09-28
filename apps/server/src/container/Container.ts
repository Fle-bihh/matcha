import {
	BaseRepository,
	HelloRepository,
	UserRepository,
} from "@/repositories";
import { HelloService, UserService, AuthService } from "@/services";
import { ETokens, IContainer } from "@/types";

type ServiceConstructor = new (container: IContainer) => any;

const services: Record<ETokens, ServiceConstructor> = {
	[ETokens.BaseRepository]: BaseRepository,
	[ETokens.HelloRepository]: HelloRepository,
	[ETokens.HelloService]: HelloService,
	[ETokens.UserRepository]: UserRepository,
	[ETokens.UserService]: UserService,
	[ETokens.AuthService]: AuthService,
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
