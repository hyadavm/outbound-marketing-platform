import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT as any);

router.get('/sequences', EmailController.getSequences as any);
router.post('/sequences', EmailController.saveSequence as any);
router.put('/sequences/:id', EmailController.updateSequence as any);
router.delete('/sequences/:id', EmailController.deleteSequence as any);
router.post('/simulate-send', EmailController.simulateSend as any);
router.post('/track-event', EmailController.trackEvent as any);
router.get('/events', EmailController.getEvents as any);

export default router;
