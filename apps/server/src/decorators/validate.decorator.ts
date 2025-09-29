import "reflect-metadata";
import { logger } from "@matcha/shared";
import type { Request, Response, NextFunction } from "express";
import { z, type ZodType } from "zod";
import { METADATA_KEYS } from "@/constants/metadata.constants";
import { ServiceResponse, ValidateMetadata } from "@/types";
import { StatusCodes } from "http-status-codes";

export function Validate<T extends ZodType>(
	schema: T,
	source: "query" | "body" | "params" = "query"
) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		const metadata: ValidateMetadata = { schema, source };
		Reflect.defineMetadata(
			METADATA_KEYS.Validate,
			metadata,
			target,
			propertyKey
		);

		const originalMethod = descriptor.value;

		descriptor.value = function (
			req: Request,
			res: Response,
			next?: NextFunction
		) {
			try {
				let data = req[source];

				if (data === undefined) {
					if (source === "body") {
						data = {};
					} else if (source === "query") {
						data = {};
					} else if (source === "params") {
						data = {};
					}
				}

				const validatedData = schema.parse(data);

				if (!req.validated) {
					req.validated = {};
				}
				req.validated[source] = validatedData;

				try {
					if (source === "body") {
						req.body = validatedData;
					} else if (source === "params") {
						Object.assign(req.params, validatedData);
					} else if (source === "query") {
						Object.assign(req.query, validatedData);
					}
				} catch (assignError) {
					logger.debug(
						`Could not assign validated data to req.${source}, using req.validated.${source} instead`
					);
				}

				return originalMethod.call(this, req, res, next);
			} catch (error) {
				if (error instanceof z.ZodError) {
					const response = ServiceResponse.failure(
						"Validation failed",
						{
							details: error.issues.map((issue) => {
								const fieldPath =
									issue.path.length > 0
										? issue.path.join(".")
										: source === "body"
										? "request body"
										: source;

								return {
									field: fieldPath,
									message: issue.message,
									value:
										"received" in issue
											? issue.received
											: undefined,
								};
							}),
						},
						StatusCodes.BAD_REQUEST
					);
					return res.status(StatusCodes.BAD_REQUEST).json(response);
				}

				throw error;
			}
		};

		return descriptor;
	};
}
