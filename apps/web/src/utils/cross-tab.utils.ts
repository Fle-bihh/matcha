import {
	CrossTabEvent,
	CrossTabEventPayloadMap,
	CrossTabMessage,
} from "@/types";
import { logger } from "@matcha/shared";

class CrossTabCommunication {
	private channel: BroadcastChannel | null = null;
	private listeners: Map<CrossTabEvent, Set<(payload: unknown) => void>> =
		new Map();
	private readonly STORAGE_KEY = "matcha-cross-tab";
	private readonly CHANNEL_NAME = "matcha-app";

	constructor() {
		this.initChannel();
		this.setupStorageFallback();
	}

	private initChannel() {
		if (typeof BroadcastChannel !== "undefined") {
			this.channel = new BroadcastChannel(this.CHANNEL_NAME);
			this.channel.onmessage = (event: MessageEvent<CrossTabMessage>) => {
				this.handleMessage(event.data);
			};
		}
	}

	private setupStorageFallback() {
		if (!this.channel) {
			window.addEventListener("storage", (event) => {
				if (event.key === this.STORAGE_KEY && event.newValue) {
					try {
						const message: CrossTabMessage = JSON.parse(
							event.newValue,
						);
						this.handleMessage(message);
					} catch (error) {
						logger.error(
							"Failed to parse cross-tab message:",
							error,
						);
					}
				}
			});
		}
	}

	private handleMessage<T extends CrossTabEvent>(
		message: CrossTabMessage<T>,
	) {
		const listeners = this.listeners.get(message.type);
		if (listeners) {
			listeners.forEach((callback) => callback(message.payload));
		}
	}

	public broadcast<T extends CrossTabEvent>(
		type: T,
		...args: CrossTabEventPayloadMap[T] extends void
			? []
			: [payload: CrossTabEventPayloadMap[T]]
	) {
		const message: CrossTabMessage<T> = {
			type,
			payload: args[0] as CrossTabEventPayloadMap[T],
			timestamp: Date.now(),
		};

		if (this.channel) {
			this.channel.postMessage(message);
		} else {
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(message));
			setTimeout(() => {
				localStorage.removeItem(this.STORAGE_KEY);
			}, 100);
		}
	}

	public on<T extends CrossTabEvent>(
		type: T,
		callback: (payload: CrossTabEventPayloadMap[T]) => void,
	) {
		if (!this.listeners.has(type)) {
			this.listeners.set(type, new Set());
		}
		this.listeners.get(type)!.add(callback as (payload: unknown) => void);

		return () => {
			this.listeners
				.get(type)
				?.delete(callback as (payload: unknown) => void);
		};
	}

	public off<T extends CrossTabEvent>(
		type: T,
		callback: (payload: CrossTabEventPayloadMap[T]) => void,
	) {
		this.listeners
			.get(type)
			?.delete(callback as (payload: unknown) => void);
	}

	public destroy() {
		if (this.channel) {
			this.channel.close();
		}
		this.listeners.clear();
	}
}

export const crossTab = new CrossTabCommunication();
