import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

export interface MailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

/**
 * Thin SMTP wrapper. When SMTP_HOST is not configured, sending is skipped (and logged) so the
 * rest of the app keeps working in local development.
 */
export class MailService {
  private transporter: Transporter | null = null;

  get isConfigured(): boolean {
    return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
  }

  private getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      });
    }
    return this.transporter;
  }

  /** Returns true when the message was handed to the SMTP server. Never throws. */
  async send(params: MailParams): Promise<boolean> {
    if (!this.isConfigured) {
      logger.warn({ to: params.to, subject: params.subject }, 'SMTP not configured; email not sent');
      return false;
    }
    try {
      await this.getTransporter().sendMail({
        from: env.MAIL_FROM || env.SMTP_USER,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
        replyTo: params.replyTo,
      });
      return true;
    } catch (err) {
      logger.error({ err: (err as Error).message, to: params.to }, 'Failed to send email');
      return false;
    }
  }
}

export const mailService = new MailService();
