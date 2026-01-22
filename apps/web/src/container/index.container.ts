import { ETokens, IContainer } from "@/types";
import {
	ApiService,
	AuthService,
	StorageService,
	UserService,
	SnackbarService,
	BrowsingService,
	LikeService,
	MatchService,
	WebSocketService,
	VisitService,
	WebSocketSubscriptionService,
	ReportService,
	BlockService,
	MessageService,
	NotificationService,
} from "@/services";
import { LocationService } from "@/services";
import { TReduxStore } from "@/types";
import { createStore } from "@/store";
import { logger } from "@matcha/shared";
import { RouterService } from "@/services";

type ServiceConstructor = new (container: IContainer) => any;

const serviceConstructors: Record<ETokens, ServiceConstructor> = {
	[ETokens.ApiService]: ApiService,
	[ETokens.UserService]: UserService,
	[ETokens.AuthService]: AuthService,
	[ETokens.StorageService]: StorageService,
	[ETokens.RouterService]: RouterService,
	[ETokens.SnackbarService]: SnackbarService,
	[ETokens.LocationService]: LocationService,
	[ETokens.BrowsingService]: BrowsingService,
	[ETokens.LikeService]: LikeService,
	[ETokens.MatchService]: MatchService,
	[ETokens.WebSocketService]: WebSocketService,
	[ETokens.VisitService]: VisitService,
	[ETokens.WebSocketSubscriptionService]: WebSocketSubscriptionService,
	[ETokens.ReportService]: ReportService,
	[ETokens.BlockService]: BlockService,
	[ETokens.MessageService]: MessageService,
	[ETokens.NotificationService]: NotificationService,
} as const;

export class Container implements IContainer {
	private readonly services = new Map<ETokens, any>();
	public readonly store: TReduxStore;
	private navigateFunc?: (
		path: string,
		options?: { replace?: boolean },
	) => void;

	constructor() {
		this.store = createStore(this);
	}

	public setNavigate(
		navigateFunc: (path: string, options?: { replace?: boolean }) => void,
	): void {
		this.navigateFunc = navigateFunc;
	}

	public navigate(path: string, options?: { replace?: boolean }): void {
		if (!this.navigateFunc) {
			logger.warn("Navigate function not set in container");
			return;
		}
		this.navigateFunc(path, options);
	}

	public get<T>(token: ETokens): T {
		return (
			this.services.get(token) ??
			this.services
				.set(token, new serviceConstructors[token](this))
				.get(token)
		);
	}
}
