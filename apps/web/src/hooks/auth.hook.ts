import { useSelector } from "react-redux";
import { AuthActions, UserActions } from "@/store";
import {
  selectAuthUser,
  selectIsAuthInitialized,
} from "@/store/selectors/auth.selectors";
import { useCreateAction } from "./actions.hooks";

export const useAuthUser = () => {
  const createAction = useCreateAction();
  const authUser = useSelector(selectAuthUser);
  const isInitialized = useSelector(selectIsAuthInitialized);

  const authActions = {
    register: createAction(AuthActions.register),
    authenticate: createAction(AuthActions.authenticate),
    logout: createAction(AuthActions.logout),
    login: createAction(AuthActions.login),
    verifyEmail: createAction(AuthActions.verifyEmail),
    resendVerificationEmail: createAction(AuthActions.resendVerificationEmail),
    forgotPassword: createAction(AuthActions.forgotPassword),
    resetPassword: createAction(AuthActions.resetPassword),
  };

  const userActions = {
    updateProfile: createAction(UserActions.updateProfile),
    updateProfilePicture: createAction(UserActions.updateProfilePicture),
  };

  return {
    authUser,
    isInitialized,

    ...authActions,
    ...userActions,
  };
};
