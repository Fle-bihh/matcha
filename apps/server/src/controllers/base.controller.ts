import { IContainer, ServiceResponse } from "@/types";
import { ApiResponse } from "@matcha/shared";
import type { Request, Response } from "express";

export abstract class BaseController {
  protected container: IContainer;

  constructor(container: IContainer) {
    this.container = container;
  }

  protected sendResult<T>(res: Response, result: ServiceResponse<T>): void {
    const data: ApiResponse<T> = {
      message: result.message,
      data: result.data,
    };
    res.status(result.statusCode).send(data);
  }
}
