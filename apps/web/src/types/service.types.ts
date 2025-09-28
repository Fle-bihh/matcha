import { z } from "zod";

export class ServiceResponse<T = null> {
	readonly success: boolean;
	readonly responseObject: T;

	private constructor(success: boolean, responseObject: T) {
		this.success = success;
		this.responseObject = responseObject;
	}

	static success<T>(responseObject: T) {
		return new ServiceResponse(true, responseObject);
	}

	static failure<T>(responseObject: T) {
		return new ServiceResponse(false, responseObject);
	}
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		responseObject: dataSchema.optional(),
	});
