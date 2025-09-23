import type { ControllerConstructor } from "@/registry/ControllerRegistry";
import { ControllerRegistry } from "@/registry/ControllerRegistry";

export function Controller(target: ControllerConstructor): void {
	ControllerRegistry.register(target);
}
