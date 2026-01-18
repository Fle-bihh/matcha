import { ETokens } from "@/types";
import { EActionKeys } from "@/types";
import { createActions } from "./base.actions";

export const LikeActions = createActions(ETokens.LikeService, [
	EActionKeys.CreateLike,
	EActionKeys.UnlikeUser,
] as const);
