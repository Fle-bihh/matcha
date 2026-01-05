import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

export const BrowsingActions = createActions(ETokens.BrowsingService, [
	EActionKeys.GetUsers,
	EActionKeys.ApplyBrowsingFilters,
	EActionKeys.ClearBrowsingFilters,
] as const);
