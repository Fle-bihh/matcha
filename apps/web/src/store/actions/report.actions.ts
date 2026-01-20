import { EActionKeys, ETokens } from "@/types";
import { createActions } from "./base.actions";

export const ReportActions = createActions(ETokens.ReportService, [
	EActionKeys.CreateReport,
] as const);
