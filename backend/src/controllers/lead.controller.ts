import { Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateLeadInput } from '../validators/lead.validator';

export class LeadController {
  static async getLeads(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await LeadService.getLeads(userId, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      next(error);
    }
  }

  static async getLeadById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const lead = await LeadService.getLeadById(userId, req.params.id);
      res.status(200).json({ success: true, lead });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async createLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const validation = validateLeadInput(req.body);
      if (!validation.isValid) {
        res.status(400).json({ success: false, errors: validation.errors });
        return;
      }

      const lead = await LeadService.createLead(userId, req.body);
      res.status(201).json({ success: true, lead });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const lead = await LeadService.updateLead(userId, req.params.id, req.body);
      res.status(200).json({ success: true, lead });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await LeadService.deleteLead(userId, req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
