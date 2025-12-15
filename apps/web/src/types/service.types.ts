import { z } from "zod";

export class ServiceResponse {
	readonly success: boolean;
	// readonly responseObject?: T;
	readonly message: string;

	private constructor(success: boolean, message: string) {
		this.success = success;
		// this.responseObject = responseObject
		this.message = message;
	}

	static success(message: string) {
		return new ServiceResponse(true, message);
	}

	static failure(message: string) {
		return new ServiceResponse(false, message);
	}
}
