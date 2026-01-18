import { useEffect } from "react";
import { crossTab } from "@/utils";
import { useAuthUser } from "./auth.hook";
import { useDispatch } from "react-redux";
import { changeEmail, setEmailToVerified } from "@/store";
import { CrossTabEvent } from "@/types";

export function useCrossTabSync() {
  const dispatch = useDispatch();
  const { authUser } = useAuthUser();

  useEffect(() => {
    const unsubscribers = [
      crossTab.on(CrossTabEvent.EmailVerified, () => {
        if (authUser && !authUser.is_email_verified) {
          dispatch(setEmailToVerified());
        }
      }),
      crossTab.on(CrossTabEvent.EmailChanged, (newEmail) => {
        if (authUser) {
          dispatch(changeEmail(newEmail));
        }
      }),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [authUser, dispatch]);
}
