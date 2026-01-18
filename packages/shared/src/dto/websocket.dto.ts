import { UserStatus } from "../models";

export interface SubscribeChannelRequestDto {
	channel: string;
}

export interface UnsubscribeChannelRequestDto {
	channel: string;
}

export interface SubscriptionConfirmationDto {
	channel: string;
	subscribed: boolean;
}

export interface UserStatusUpdateDto {
	user_id: number;
	status: UserStatus;
}
