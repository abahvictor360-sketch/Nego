import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export interface AuthenticatedRequest extends Request {
  merchant?: { id: string; name: string; email: string };
}

export async function apiKeyAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const apiKey = req.headers['x-api-key'] as string | undefined;

  if (!apiKey) {
    res.status(401).json({ error: 'Missing x-api-key header' });
    return;
  }

  const merchant = await prisma.merchant.findUnique({
    where: { apiKey },
    select: { id: true, name: true, email: true },
  });

  if (!merchant) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  req.merchant = merchant;
  next();
}
