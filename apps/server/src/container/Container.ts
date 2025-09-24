import { BaseRepository, HelloRepository } from "@/repositories";
import { UserRepository } from "@/repositories/UserRepository";
import { HelloService, UserService } from "@/services";
import { ETokens, IContainer } from "@/types/container";

type ServiceConstructor = new (container: IContainer) => any;

const services: Record<ETokens, ServiceConstructor> = {
	[ETokens.BaseRepository]: BaseRepository,
	[ETokens.HelloRepository]: HelloRepository,
	[ETokens.HelloService]: HelloService,
	[ETokens.UserRepository]: UserRepository,
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
