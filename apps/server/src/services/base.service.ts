import { IContainer } from "@/types";

export abstract class BaseService {
	protected container: IContainer;

	constructor(container: IContainer) {
		this.container = container;
	}
}
