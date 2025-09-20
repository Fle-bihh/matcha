export class Container {
	private readonly registry = new Map<string, unknown>();

	public register<T>(key: string, instance: T): void {
		this.registry.set(key, instance);
	}

	public resolve<T>(key: string): T {
		const instance = this.registry.get(key);
		if (!instance) throw new Error(`Dependency not found: ${key}`);
		return instance as T;
	}
}

export const container = new Container();
