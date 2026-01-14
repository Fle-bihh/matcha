import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

export const LikeActions = createActions(ETokens.LikeService, [
	EActionKeys.CreateLike,
] as const);
