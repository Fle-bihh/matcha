import { ApiResponse } from "@matcha/shared";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ServiceResponse<T = null> implements ApiResponse<T> {
  readonly message: string;
  readonly data: T;
  readonly statusCode: number;

  private constructor(message: string, data: T, statusCode: number) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.OK
  ) {
    return new ServiceResponse(message, data, statusCode);
  }

  static failure<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.BAD_REQUEST
  ) {
    return new ServiceResponse(message, data, statusCode);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string(),
    data: dataSchema.optional(),
    statusCode: z.number(),
  });
