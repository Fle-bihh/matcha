import { ETokens, IContainer } from "@/types";
import { MailService } from "./mail.service";
import { FileUploadService } from "./file-upload.service";

export abstract class BaseService {
  protected container: IContainer;

  constructor(container: IContainer) {
    this.container = container;
  }

  protected get mailService() {
    return this.container.get<MailService>(ETokens.MailService);
  }

  protected get fileUploadService(): FileUploadService {
    return this.container.get<FileUploadService>(ETokens.FileUploadService);
  }
}
