import { HelloService, DatabaseService } from "@/services";

export interface ServiceContext {
	HelloService: HelloService;
	DatabaseService: DatabaseService;
}

class ServiceRegistry {
	private static instance: ServiceRegistry;
	private services: ServiceContext;

	private constructor() {
		const databaseService = new DatabaseService();

		this.services = {
			HelloService: new HelloService(databaseService),
			DatabaseService: databaseService,
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
