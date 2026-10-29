import { AppDataSource } from '../config/database';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ContactMessage } from '../database/entities/contact-message.entity';
import { SubmitContactInput } from '../schemas/contact.schemas';
import { mailService } from './mail.service';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export class ContactService {
  private get repo() {
    return AppDataSource.getRepository(ContactMessage);
  }

  /**
   * Stores the message first (so nothing is lost if email delivery fails), then emails the
   * support inbox. The visitor gets a success response as long as the message was stored.
   */
  async submit(input: SubmitContactInput, ipAddress?: string): Promise<{ id: string }> {
    const saved = await this.repo.save(
      this.repo.create({
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        topic: input.topic,
        message: input.message,
        ipAddress: ipAddress ?? null,
      })
    );

    const phoneLine = input.phone ? `Phone: ${input.phone}\n` : '';
    const text =
      `New message from the RaiseFundz website\n\n` +
      `Name: ${input.name}\nEmail: ${input.email}\n${phoneLine}Topic: ${input.topic}\n\n${input.message}\n`;
    const html =
      `<h2>New message from the RaiseFundz website</h2>` +
      `<p><strong>Name:</strong> ${escapeHtml(input.name)}<br>` +
      `<strong>Email:</strong> ${escapeHtml(input.email)}<br>` +
      (input.phone ? `<strong>Phone:</strong> ${escapeHtml(input.phone)}<br>` : '') +
      `<strong>Topic:</strong> ${escapeHtml(input.topic)}</p>` +
      `<p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`;

    const emailSent = await mailService.send({
      to: env.CONTACT_TO_EMAIL,
      subject: `[RaiseFundz] ${input.topic} - ${input.name}`,
      text,
      html,
      replyTo: input.email,
    });

    if (emailSent) {
      await this.repo.update(saved.id, { emailSent: true });
    } else {
      logger.warn({ contactMessageId: saved.id }, 'Contact message stored but notification email was not sent');
    }

    return { id: saved.id };
  }
}

export const contactService = new ContactService();
