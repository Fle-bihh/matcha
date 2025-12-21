import { IContainer } from "@/types";
import { showSnackbar, type ShowSnackbarPayload } from "@/store";

export class SnackbarService {
  private container: IContainer;

  constructor(container: IContainer) {
    this.container = container;
  }

  private get dispatch() {
    return this.container.store.dispatch;
  }

  public success(message: string): void {
    this.show({ message, severity: "success" });
  }

  public error(message: string): void {
    this.show({ message, severity: "error" });
  }

  public warning(message: string): void {
    this.show({ message, severity: "warning" });
  }

  public info(message: string): void {
    this.show({ message, severity: "info" });
  }

  public show(payload: ShowSnackbarPayload): void {
    this.dispatch(showSnackbar(payload));
  }
}
