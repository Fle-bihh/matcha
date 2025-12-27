import { ETokens, IContainer } from "@/types";
import { ApiService } from "./api.service";
import { StorageService } from "./storage.service";
import { AuthService } from "./auth.service";
import { RouterService } from "./router.service";
import { SnackbarService } from "./snackbar.service";
import { LocationService } from "./location.service";

export abstract class BaseService {
  protected container: IContainer;

  constructor(container: IContainer) {
    this.container = container;
  }

  protected get dispatch() {
    return this.container.store.dispatch;
  }

  protected get apiService(): ApiService {
    return this.container.get<ApiService>(ETokens.ApiService);
  }

  protected get storageService(): StorageService {
    return this.container.get<StorageService>(ETokens.StorageService);
  }

  protected get authService(): AuthService {
    return this.container.get<AuthService>(ETokens.AuthService);
  }

  protected get router(): RouterService {
    return this.container.get<RouterService>(ETokens.RouterService);
  }

  protected get snackbar(): SnackbarService {
    return this.container.get<SnackbarService>(ETokens.SnackbarService);
  }

  protected get locationService(): LocationService {
    return this.container.get<LocationService>(ETokens.LocationService);
  }
}
