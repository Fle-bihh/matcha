import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

const userActionsConfig = {
  [EActionKeys.UpdateProfile]: {
    serviceToken: ETokens.UserService,
    methodName: "updateProfile",
  },
  [EActionKeys.UpdateProfilePicture]: {
    serviceToken: ETokens.UserService,
    methodName: "updateProfilePicture",
  },
} as const;

export const UserActions = createActions(userActionsConfig);
