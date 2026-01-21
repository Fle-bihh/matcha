import { BaseService } from "./base.service";
import { ETokens } from "@/types";
import { WebSocketService } from "./websocket.service";
import {
	SubscribeChannelRequestDto,
	UnsubscribeChannelRequestDto,
	WebSocketEvents,
} from "@matcha/shared";

export class WebSocketSubscriptionService extends BaseService {
	public async subscribeToChannel(
		dto: SubscribeChannelRequestDto,
	): Promise<void> {
		this.webSocketService.emit(WebSocketEvents.Subscribe, dto);
	}

	public async unsubscribeFromChannel(
		dto: UnsubscribeChannelRequestDto,
	): Promise<void> {
		this.webSocketService.emit(WebSocketEvents.Unsubscribe, dto);
	}
}
