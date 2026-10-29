import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/utils/response';
import { SubmitContactInput } from '../schemas/contact.schemas';
import { contactService } from '../services/contact.service';

export class ContactController {
  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as SubmitContactInput;

      // Honeypot filled in => a bot. Pretend it worked, store nothing.
      if (input.website) {
        ApiResponse.success(res, null, 'Message received', 201);
        return;
      }

      await contactService.submit(input, req.ip);
      ApiResponse.success(res, null, 'Message received', 201);
    } catch (err) {
      next(err);
    }
  }
}

export const contactController = new ContactController();
