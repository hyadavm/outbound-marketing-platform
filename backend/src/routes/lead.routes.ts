import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT as any);

router.get('/', LeadController.getLeads as any);
router.post('/', LeadController.createLead as any);
router.get('/:id', LeadController.getLeadById as any);
router.put('/:id', LeadController.updateLead as any);
router.delete('/:id', LeadController.deleteLead as any);

export default router;
