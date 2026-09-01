import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AnalyticsController {
  static async getOverview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const data = await AnalyticsService.getOverviewStats(userId);
      res.status(200).json({ success: true, ...data });
    } catch (error: any) {
      next(error);
    }
  }

  static async getCampaignPerformance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const campaigns = await AnalyticsService.getCampaignPerformance(userId);
      res.status(200).json({ success: true, campaigns });
    } catch (error: any) {
      next(error);
    }
  }
}
