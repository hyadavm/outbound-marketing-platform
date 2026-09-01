import { Response, NextFunction } from 'express';
import { CampaignService } from '../services/campaign.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateCampaignInput } from '../validators/campaign.validator';

export class CampaignController {
  static async getCampaigns(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await CampaignService.getCampaigns(userId, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      next(error);
    }
  }

  static async getCampaignById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const campaign = await CampaignService.getCampaignById(userId, req.params.id);
      res.status(200).json({ success: true, campaign });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async createCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const validation = validateCampaignInput(req.body);
      if (!validation.isValid) {
        res.status(400).json({ success: false, errors: validation.errors });
        return;
      }

      const campaign = await CampaignService.createCampaign(userId, req.body);
      res.status(201).json({ success: true, campaign });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { status } = req.body;
      const result = await CampaignService.updateCampaignStatus(userId, req.params.id, status);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await CampaignService.deleteCampaign(userId, req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
