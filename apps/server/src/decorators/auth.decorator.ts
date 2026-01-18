import { authenticateRequest } from "@/middleware";

export function auth() {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			const req = args[0];
			const res = args[1];

			authenticateRequest(req, res, () => {
				return originalMethod.apply(this, args);
			});
		};

		return descriptor;
	};
}
