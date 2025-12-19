import { BaseService } from "./base.service";

export class RouterService extends BaseService {
  public navigateTo(path: string, replace = false): void {
    this.container.navigate(path, { replace });
  }

  public goBack(): void {
    this.container.navigate(-1 as any);
  }

  public replace(path: string): void {
    this.navigateTo(path, true);
  }
}
