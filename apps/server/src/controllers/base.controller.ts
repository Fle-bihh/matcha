import { IContainer } from "@/types";

export abstract class BaseController {
	protected container: IContainer;

	constructor(container: IContainer) {
		this.container = container;
	}
}
