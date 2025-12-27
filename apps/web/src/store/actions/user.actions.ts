import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

export const UserActions = createActions(ETokens.UserService, [
  EActionKeys.UpdateProfile,
  EActionKeys.UpdateProfilePicture,
] as const);
