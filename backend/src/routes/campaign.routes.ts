import { Router } from 'express';
import { CampaignController } from '../controllers/campaign.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT as any);

router.get('/', CampaignController.getCampaigns as any);
router.post('/', CampaignController.createCampaign as any);
router.get('/:id', CampaignController.getCampaignById as any);
router.patch('/:id/status', CampaignController.updateStatus as any);
router.delete('/:id', CampaignController.deleteCampaign as any);

export default router;
