import { IContainer } from "@/types/container";

export abstract class BaseController {
	protected container: IContainer;

	constructor(container: IContainer) {
		this.container = container;
	}
}
