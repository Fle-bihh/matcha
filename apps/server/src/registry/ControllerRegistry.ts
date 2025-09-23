import type { BaseController } from "@/controllers/BaseController";

type ControllerConstructor = new () => BaseController;

class ControllerRegistry {
	private static readonly controllers: ControllerConstructor[] = [];

	public static register(controllerClass: ControllerConstructor): void {
		this.controllers.push(controllerClass);
	}

	public static getAll(): readonly ControllerConstructor[] {
		return this.controllers;
	}

	public static createInstances(): BaseController[] {
		return this.controllers.map((ControllerClass) => new ControllerClass());
	}
}

export { ControllerRegistry };
export type { ControllerConstructor };
