import { ETokens, IContainer } from "@/types";
import { MailService } from "./mail.service";

export abstract class BaseService {
  protected container: IContainer;

  constructor(container: IContainer) {
    this.container = container;
  }

  protected get mailService() {
    return this.container.get<MailService>(ETokens.MailService);
  }
}
