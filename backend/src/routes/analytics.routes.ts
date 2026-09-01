import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT as any);

router.get('/overview', AnalyticsController.getOverview as any);
router.get('/campaigns', AnalyticsController.getCampaignPerformance as any);

export default router;
