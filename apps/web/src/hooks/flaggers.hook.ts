import { useDispatch, useSelector } from "react-redux";
import { setFlagger, toggleFlagger, openFlagger, closeFlagger } from "@/store";
import { TRootState } from "@/types";
import { EFlaggers } from "@/constants/flaggers.constants";

interface UseFlaggerReturn {
  isOpen: boolean;
  setFlagger: (value: boolean) => void;
  toggleFlagger: () => void;
  openFlagger: () => void;
  closeFlagger: () => void;
}

export function useFlagger(flagger: EFlaggers): UseFlaggerReturn {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: TRootState) => state.flaggers[flagger]);

  const setFlaggerValue = (value: boolean) => {
    dispatch(setFlagger({ key: flagger, value }));
  };

  const toggleFlaggerValue = () => {
    dispatch(toggleFlagger(flagger));
  };

  const openFlaggerValue = () => {
    dispatch(openFlagger(flagger));
  };

  const closeFlaggerValue = () => {
    dispatch(closeFlagger(flagger));
  };

  return {
    isOpen,
    setFlagger: setFlaggerValue,
    toggleFlagger: toggleFlaggerValue,
    openFlagger: openFlaggerValue,
    closeFlagger: closeFlaggerValue,
  };
}
