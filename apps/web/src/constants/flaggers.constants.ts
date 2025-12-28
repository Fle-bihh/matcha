export enum EFlaggers {
  ChangeEmailDialog = "changeEmailDialog",
  ChangeLocationDialog = "changeLocationDialog",
}

export type FlaggerDataMap = {
  [EFlaggers.ChangeEmailDialog]: DialogFlagger;
  [EFlaggers.ChangeLocationDialog]: DialogFlagger;
};

export const FLAGGERS_INITIAL_STATE: FlaggerDataMap = {
  [EFlaggers.ChangeEmailDialog]: { isOpen: false },
  [EFlaggers.ChangeLocationDialog]: { isOpen: false },
};

export type FlaggerData<T extends EFlaggers> = FlaggerDataMap[T];

export interface DialogFlagger {
  isOpen: boolean;
}
