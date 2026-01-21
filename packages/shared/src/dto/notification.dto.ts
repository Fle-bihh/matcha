import { Notification } from "../models";
import { PaginatedResponse } from "../types";

export interface GetNotificationsResponseDto {
	notifications: PaginatedResponse<Notification>;
}
