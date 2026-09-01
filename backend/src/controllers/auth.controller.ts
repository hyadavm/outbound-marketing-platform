import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { validateRegisterInput, validateLoginInput } from '../validators/auth.validator';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateRegisterInput(req.body);
      if (!validation.isValid) {
        res.status(400).json({ success: false, errors: validation.errors });
        return;
      }

      const result = await AuthService.register(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validateLoginInput(req.body);
      if (!validation.isValid) {
        res.status(400).json({ success: false, errors: validation.errors });
        return;
      }

      const result = await AuthService.login(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await AuthService.getUserProfile(userId);
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const updatedUser = await AuthService.updateProfile(userId, req.body);
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
