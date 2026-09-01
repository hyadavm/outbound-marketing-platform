import { Response, NextFunction } from 'express';
import { EmailService } from '../services/email.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class EmailController {
  static async getSequences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaignId = req.query.campaignId as string;
      if (!campaignId) {
        res.status(400).json({ success: false, message: 'campaignId query parameter is required' });
        return;
      }
      const sequences = await EmailService.getSequencesByCampaign(campaignId);
      res.status(200).json({ success: true, sequences });
    } catch (error: any) {
      next(error);
    }
  }

  static async saveSequence(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { campaignId, step_number, delay_days, subject, body } = req.body;
      const sequence = await EmailService.saveSequenceStep(campaignId, { step_number, delay_days, subject, body });
      res.status(201).json({ success: true, sequence });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateSequence(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const sequence = await EmailService.updateSequenceStep(req.params.id, req.body);
      res.status(200).json({ success: true, sequence });
    } catch (error: any) {
      next(error);
    }
  }

  static async deleteSequence(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await EmailService.deleteSequenceStep(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  static async simulateSend(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { campaignId } = req.body;
      const result = await EmailService.simulateEmailSend(campaignId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async trackEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { emailId, eventType, metadata } = req.body;
      const event = await EmailService.trackEvent(emailId, eventType, metadata);
      res.status(201).json({ success: true, event });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getEvents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaignId = req.query.campaignId as string;
      const events = await EmailService.getEmailEvents(campaignId);
      res.status(200).json({ success: true, events });
    } catch (error: any) {
      next(error);
    }
  }
}
