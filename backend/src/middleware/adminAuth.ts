import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './apiKeyAuth';

/**
 * Must run AFTER apiKeyAuth. Rejects any non-admin merchant.
 */
export function adminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.merchant?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}
