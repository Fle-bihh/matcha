import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

export const MatchActions = createActions(ETokens.MatchService, [
	EActionKeys.GetMatches,
] as const);
