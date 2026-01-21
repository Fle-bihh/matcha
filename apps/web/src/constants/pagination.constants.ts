export enum EPagerKeys {
	Users = "users",
	Matches = "matches",
	Visits = "visits",
	Notifications = "notifications",
}

type TMessagesPagerKey = `messages-${string}`;

export const getMessagesPagerKey = (matchId: string): TMessagesPagerKey => {
	return `messages-${matchId}`;
};

export type TPagerKey = EPagerKeys | TMessagesPagerKey;

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;
