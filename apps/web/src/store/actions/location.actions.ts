import { ETokens } from "@/types";
import { EActionKeys } from "@/types/actions.types";
import { createActions } from "./base.actions";

export const LocationActions = createActions(ETokens.LocationService, [
  EActionKeys.GetCurrentPosition,
  EActionKeys.SearchLocation,
  EActionKeys.CreateManualLocation,
] as const);
