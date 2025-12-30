import { ApiResponse } from "@matcha/shared";

export interface ApiRequestResponse<T> extends ApiResponse<T> {
  status: number;
}
