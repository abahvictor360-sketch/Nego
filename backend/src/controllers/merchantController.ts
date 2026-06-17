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
