import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/apiKeyAuth';
import { notify } from '../lib/notify';

const PRO_PRICE = Number(process.env.PRO_PLAN_PRICE ?? 49); // monthly, USD

// ─── Users ───────────────────────────────────────────────────────────────────

export async function listUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  const merchants = await prisma.merchant.findMany({
    where: { role: 'merchant' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, plan: true, status: true,
      botName: true, language: true, createdAt: true,
      _count: { select: { products: true, sessions: true } },
    },
  });
  res.json(merchants);
}

const updateUserSchema = z.object({
  plan: z.enum(['free', 'pro']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
});

export async function updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id as string;
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const target = await prisma.merchant.findUnique({ where: { id }, select: { role: true } });
  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (target.role === 'admin') {
    res.status(403).json({ error: 'Cannot modify an admin account' });
    return;
  }

  const updated = await prisma.merchant.update({
    where: { id },
    data: result.data,
    select: { id: true, name: true, email: true, plan: true, status: true },
  });

  // Notify the affected user about meaningful account changes.
  if (result.data.plan) {
    await notify({
      merchantId: id,
      type: 'plan_changed',
      title: `Your plan is now ${result.data.plan === 'pro' ? 'Pro' : 'Free'}`,
      body: result.data.plan === 'pro'
        ? 'You now have access to all Pro features. 🎉'
        : 'Your account has been moved to the Free plan.',
      link: '/dashboard/settings',
    });
  }
  if (result.data.status) {
    await notify({
      merchantId: id,
      type: result.data.status === 'suspended' ? 'account_suspended' : 'account_restored',
      title: result.data.status === 'suspended' ? 'Account suspended' : 'Account restored',
      body: result.data.status === 'suspended'
        ? 'Your account has been suspended. Contact support for help.'
        : 'Your account is active again. Welcome back!',
      link: '/dashboard/support',
    });
  }

  res.json(updated);
}

// ─── Billing overview ──────────────────────────────────────────────────────

export async function billingOverview(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const [proCount, freeCount, suspendedCount, total] = await Promise.all([
    prisma.merchant.count({ where: { role: 'merchant', plan: 'pro' } }),
    prisma.merchant.count({ where: { role: 'merchant', plan: 'free' } }),
    prisma.merchant.count({ where: { role: 'merchant', status: 'suspended' } }),
    prisma.merchant.count({ where: { role: 'merchant' } }),
  ]);

  const proUsers = await prisma.merchant.findMany({
    where: { role: 'merchant', plan: 'pro' },
    select: { id: true, name: true, email: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    mrr: proCount * PRO_PRICE,
    proPrice: PRO_PRICE,
    counts: { total, pro: proCount, free: freeCount, suspended: suspendedCount },
    proUsers,
  });
}
