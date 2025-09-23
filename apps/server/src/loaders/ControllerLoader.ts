import type { BaseController } from "@/controllers/BaseController";
import { ControllerRegistry } from "@/registry/ControllerRegistry";
import "@/controllers";

export class ControllerLoader {
	public static loadAllControllers(): BaseController[] {
		return ControllerRegistry.createInstances();
	}
}
