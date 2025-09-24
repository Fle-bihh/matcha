import { HelloService } from "@/services";
import { HelloRepository, BaseRepository } from "@/repositories";

export interface ServiceContext {
	HelloService: HelloService;
	BaseRepository: BaseRepository;
}

class ServiceRegistry {
	private static instance: ServiceRegistry;
	private services: ServiceContext;

	private constructor() {
		const baseRepository = new BaseRepository();
		const helloRepository = new HelloRepository();

		this.services = {
			HelloService: new HelloService(helloRepository),
			BaseRepository: baseRepository,
		};
	}

	public static getInstance(): ServiceRegistry {
		if (!ServiceRegistry.instance) {
			ServiceRegistry.instance = new ServiceRegistry();
		}
		return ServiceRegistry.instance;
	}

	public getServices(): ServiceContext {
		return this.services;
	}

	public getService<K extends keyof ServiceContext>(
		serviceName: K
	): ServiceContext[K] {
		return this.services[serviceName];
	}
}

export { ServiceRegistry };
