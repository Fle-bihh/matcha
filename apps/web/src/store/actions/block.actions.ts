import { EActionKeys, ETokens } from "@/types";
import { createActions } from "./base.actions";

export const BlockActions = createActions(ETokens.BlockService, [
	EActionKeys.CreateBlock,
] as const);
