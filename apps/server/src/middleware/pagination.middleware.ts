import { Request, Response, NextFunction } from "express";
import { PaginationParams } from "@/types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const paginationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const page = Math.max(1, parseInt(req.query.page as string) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(req.query.limit as string) || DEFAULT_LIMIT)
  );
  const offset = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    offset,
  } as PaginationParams;

  next();
};
