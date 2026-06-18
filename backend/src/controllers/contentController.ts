import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/apiKeyAuth';

export async function getContent(_req: Request, res: Response): Promise<void> {
  const row = await prisma.siteContent.findUnique({ where: { id: 'default' } });
  res.json(row?.content ?? {});
}

export async function updateContent(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { content } = req.body;
  if (!content || typeof content !== 'object') {
    res.status(400).json({ error: 'content must be a JSON object' });
    return;
  }
  const row = await prisma.siteContent.upsert({
    where: { id: 'default' },
    create: { id: 'default', content },
    update: { content },
  });
  res.json(row.content);
}
