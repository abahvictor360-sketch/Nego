import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/apiKeyAuth';

const createMerchantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function createMerchant(req: Request, res: Response): Promise<void> {
  const result = createMerchantSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { name, email, password } = result.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const merchant = await prisma.merchant.create({
      data: { name, email, password: passwordHash },
      select: { id: true, name: true, email: true, apiKey: true, createdAt: true },
    });

    res.status(201).json({
      ...merchant,
      _notice: 'Store your API key securely — it will not be shown again.',
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    throw err;
  }
}

export async function getMerchantProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  res.json(req.merchant);
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = changePasswordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { currentPassword, newPassword } = result.data;
  const merchant = await prisma.merchant.findUnique({
    where: { id: req.merchant!.id },
    select: { password: true },
  });

  if (!merchant || !(await bcrypt.compare(currentPassword, merchant.password))) {
    res.status(401).json({ error: 'Current password is incorrect' });
    return;
  }

  await prisma.merchant.update({
    where: { id: req.merchant!.id },
    data: { password: await bcrypt.hash(newPassword, 12) },
  });

  res.json({ success: true });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginMerchant(req: Request, res: Response): Promise<void> {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = result.data;
  const merchant = await prisma.merchant.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, apiKey: true, password: true },
  });

  if (!merchant) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, merchant.password);

  if (!passwordMatch) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const { password: _pw, ...safe } = merchant;
  res.json(safe);
}
