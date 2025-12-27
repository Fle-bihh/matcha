import { useSelector } from "react-redux";
import { AuthActions, UserActions, LocationActions } from "@/store";
import {
  selectAuthUser,
  selectIsAuthInitialized,
} from "@/store/selectors/auth.selectors";
import { useDispatchActions } from "./actions.hooks";

export const useAuthUser = () => {
  const authUser = useSelector(selectAuthUser);
  const isInitialized = useSelector(selectIsAuthInitialized);

  const actions = useDispatchActions({
    ...AuthActions,
    ...UserActions,
    ...LocationActions,
  });

  return {
    authUser,
    isInitialized,
    ...actions,
  };
};
