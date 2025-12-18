import nodemailer, { Transporter } from "nodemailer";
import { BaseService } from "./base.service";
import { IContainer, SendMailOptions } from "@/types";
import { config } from "@/config";
import { logger } from "@matcha/shared";

export class MailService extends BaseService {
  private transporter: Transporter | null = null;

  constructor(container: IContainer) {
    super(container);

    this.setup().catch((error) => {
      logger.error("Error setting up MailService:", error);
    });
  }

  public async setup(): Promise<void> {
    try {
      this.transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.secure,
        auth: {
          user: config.mail.user,
          pass: config.mail.password,
        },
      });

      await this.transporter.verify();
      logger.info("Mail service configured successfully");
    } catch (error) {
      logger.error("Failed to setup mail service:", error);
    }
  }

  public async sendEmail(options: SendMailOptions): Promise<void> {
    if (!this.transporter) {
      logger.error("Mail transporter is not configured.");
      return;
    }

    try {
      const mailOptions = {
        from: config.mail.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error("Failed to send email:", error);
    }
  }
}
