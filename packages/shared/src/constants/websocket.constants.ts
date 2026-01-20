export const EWebSocketChannels = {
	UserStatus: (userId: number) => `user:status:${userId}`,
} as const;

export type TWebSocketChannel = ReturnType<
	typeof EWebSocketChannels.UserStatus
>;
