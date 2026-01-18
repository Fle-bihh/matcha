import { EActionKeys, ETokens } from "@/types";
import { createActions } from "./base.actions";

export const UserActions = createActions(ETokens.UserService, [
	EActionKeys.UpdateProfile,
	EActionKeys.UpdateProfilePicture,
	EActionKeys.UpdateLocation,
	EActionKeys.GetUserById,
] as const);
