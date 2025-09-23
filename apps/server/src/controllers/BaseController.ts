import {
	ServiceRegistry,
	type ServiceContext,
} from "@/registry/ServiceRegistry";

export abstract class BaseController {
	protected ctx: ServiceContext;

	constructor() {
		this.ctx = ServiceRegistry.getInstance().getServices();
	}
}
