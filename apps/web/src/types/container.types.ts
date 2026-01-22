import { TReduxStore } from "./store.types";

export enum ETokens {
	ApiService = "ApiService",
	UserService = "UserService",
	AuthService = "AuthService",
	StorageService = "StorageService",
	RouterService = "RouterService",
	SnackbarService = "SnackbarService",
	LocationService = "LocationService",
	BrowsingService = "BrowsingService",
	LikeService = "LikeService",
	MatchService = "MatchService",
	WebSocketService = "WebSocketService",
	VisitService = "VisitService",
	WebSocketSubscriptionService = "WebSocketSubscriptionService",
	ReportService = "ReportService",
	BlockService = "BlockService",
	MessageService = "MessageService",
	NotificationService = "NotificationService ",
}

export interface IContainer {
	get<T>(token: ETokens): T;
	store: TReduxStore;
	navigate: (path: string, options?: { replace?: boolean }) => void;
}
