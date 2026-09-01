import { Request, Response, NextFunction } from 'express';

export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = requiredFields.filter((field) => !req.body || req.body[field] === undefined || req.body[field] === '');
    if (missing.length > 0) {
      res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      });
      return;
    }
    next();
  };
};
