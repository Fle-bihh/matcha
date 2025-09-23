import { HelloService } from "@/services";

export interface ServiceContext {
	HelloService: HelloService;
}

class ServiceRegistry {
	private static instance: ServiceRegistry;
	private services: ServiceContext;

	private constructor() {
		this.services = {
			HelloService: new HelloService(),
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
