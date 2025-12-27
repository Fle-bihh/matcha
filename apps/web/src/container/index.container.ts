import { ETokens, IContainer } from "@/types";
import {
  ApiService,
  AuthService,
  StorageService,
  UserService,
  SnackbarService,
} from "@/services";
import { LocationService } from "@/services/location.service";
import { Store } from "@reduxjs/toolkit";
import { TAppDispatch, TReduxStore, TRootState } from "@/types";
import { createStore } from "@/store";
import { logger } from "@matcha/shared";
import { RouterService } from "@/services/router.service";

type ServiceConstructor = new (container: IContainer) => any;

const serviceConstructors: Record<ETokens, ServiceConstructor> = {
  [ETokens.ApiService]: ApiService,
  [ETokens.UserService]: UserService,
  [ETokens.AuthService]: AuthService,
  [ETokens.StorageService]: StorageService,
  [ETokens.RouterService]: RouterService,
  [ETokens.SnackbarService]: SnackbarService,
  [ETokens.LocationService]: LocationService,
} as const;

export class Container implements IContainer {
  private readonly services = new Map<ETokens, any>();
  public readonly store: TReduxStore;
  private navigateFunc?: (
    path: string,
    options?: { replace?: boolean }
  ) => void;

  constructor() {
    this.store = createStore(this) as Store<TRootState, any> & {
      dispatch: TAppDispatch;
    };
  }

  public setNavigate(
    navigateFunc: (path: string, options?: { replace?: boolean }) => void
  ): void {
    this.navigateFunc = navigateFunc;
  }

  public navigate(path: string, options?: { replace?: boolean }): void {
    if (!this.navigateFunc) {
      logger.warn("Navigate function not set in container");
      return;
    }
    this.navigateFunc(path, options);
  }

  public get<T>(token: ETokens): T {
    return (
      this.services.get(token) ??
      this.services.set(token, new serviceConstructors[token](this)).get(token)
    );
  }
}
