import { BaseService } from "./base.service";
import { ETokens } from "@/types";
import { WebSocketService } from "./websocket.service";
import {
	SubscribeChannelRequestDto,
	UnsubscribeChannelRequestDto,
	EWebSocketEvents,
} from "@matcha/shared";

export class WebSocketSubscriptionService extends BaseService {
	protected get webSocketService(): WebSocketService {
		return this.container.get<WebSocketService>(ETokens.WebSocketService);
	}

	public async subscribeToChannel(
		dto: SubscribeChannelRequestDto
	): Promise<void> {
		this.webSocketService.emit(EWebSocketEvents.Subscribe, dto);
	}

	public async unsubscribeFromChannel(
		dto: UnsubscribeChannelRequestDto
	): Promise<void> {
		this.webSocketService.emit(EWebSocketEvents.Unsubscribe, dto);
	}
}
