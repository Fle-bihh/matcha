import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

export const VisitActions = createActions(ETokens.VisitService, [
	EActionKeys.CreateVisit,
	EActionKeys.GetVisitsReceived,
] as const);
