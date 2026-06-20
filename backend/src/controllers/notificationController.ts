import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/apiKeyAuth';

export async function listNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
  const notifications = await prisma.notification.findMany({
    where: { merchantId: req.merchant!.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
  const unread = await prisma.notification.count({
    where: { merchantId: req.merchant!.id, read: false },
  });
  res.json({ notifications, unread });
}

export async function unreadCount(req: AuthenticatedRequest, res: Response): Promise<void> {
  const unread = await prisma.notification.count({
    where: { merchantId: req.merchant!.id, read: false },
  });
  res.json({ unread });
}

export async function markRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id as string;
  await prisma.notification.updateMany({
    where: { id, merchantId: req.merchant!.id },
    data: { read: true },
  });
  res.json({ success: true });
}

export async function markAllRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  await prisma.notification.updateMany({
    where: { merchantId: req.merchant!.id, read: false },
    data: { read: true },
  });
  res.json({ success: true });
}
