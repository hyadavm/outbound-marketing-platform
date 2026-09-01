import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authenticateJWT as any, AuthController.getProfile as any);
router.put('/me', authenticateJWT as any, AuthController.updateProfile as any);

export default router;
