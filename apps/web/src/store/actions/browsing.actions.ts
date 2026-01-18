import { EActionKeys, ETokens } from "@/types";
import { createActions } from "./base.actions";

export const BrowsingActions = createActions(ETokens.BrowsingService, [
	EActionKeys.GetUsers,
	EActionKeys.ApplyBrowsingFilters,
	EActionKeys.ClearBrowsingFilters,
] as const);
