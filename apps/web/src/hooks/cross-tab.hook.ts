import { useEffect } from "react";
import { crossTab, CrossTabEvent } from "@/utils/cross-tab.utils";
import { useAuthUser } from "./auth.hook";
import { useDispatch } from "react-redux";
import { setEmailToVerified } from "@/store";

export function useCrossTabSync() {
  const dispatch = useDispatch();
  const { authUser } = useAuthUser();

  useEffect(() => {
    const unsubscribe = crossTab.on(CrossTabEvent.EmailVerified, () => {
      if (authUser && !authUser.is_email_verified) {
        dispatch(setEmailToVerified());
      }
    });

    return unsubscribe;
  }, [authUser, dispatch]);
}
