import { EActionKeys, ETokens } from "@/types";
import { createActions } from "./base.actions";

export const VisitActions = createActions(ETokens.VisitService, [
	EActionKeys.CreateVisit,
	EActionKeys.GetVisitsReceived,
] as const);
