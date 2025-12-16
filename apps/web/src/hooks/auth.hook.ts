import { useSelector } from "react-redux";
import { AuthActions } from "@/store";
import {
  selectAuthUser,
  selectIsAuthInitialized,
} from "@/store/selectors/auth.selectors";
import { useCreateAction } from "./actions.hooks";

export const useAuthUser = () => {
  const createAction = useCreateAction();
  const authUser = useSelector(selectAuthUser);
  const isInitialized = useSelector(selectIsAuthInitialized);

  const actions = {
    register: createAction(AuthActions.register),
    authenticate: createAction(AuthActions.authenticate),
    logout: createAction(AuthActions.logout),
    login: createAction(AuthActions.login),
  };

  return {
    authUser,
    isInitialized,

    ...actions,
  };
};
