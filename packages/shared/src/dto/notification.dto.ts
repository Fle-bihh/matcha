import { Notification } from "../models";
import { PaginatedResponse } from "../types";

export interface GetNotificationsResponseDto {
	notifications: PaginatedResponse<Notification>;
	unread_count: number;
}

export interface ReadNotificationsResponseDto {
	notifications_ids: number[];
}
