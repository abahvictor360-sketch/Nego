import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/apiKeyAuth';
import { sendEmail, passwordResetEmail } from '../lib/email';

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

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
      select: { id: true, name: true, email: true, apiKey: true, role: true, plan: true, status: true, botName: true, language: true, createdAt: true },
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

export async function listAllMerchants(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (req.merchant!.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  const merchants = await prisma.merchant.findMany({
    where: { role: 'merchant' },
    select: { id: true, name: true, email: true, botName: true, language: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json(merchants);
}

const updateProfileSchema = z.object({
  botName: z.string().min(1).max(50).optional(),
  language: z.string().min(2).max(10).optional(),
});

export async function updateMerchantProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = updateProfileSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const updated = await prisma.merchant.update({
    where: { id: req.merchant!.id },
    data: result.data,
    select: { id: true, name: true, email: true, apiKey: true, role: true, botName: true, language: true },
  });

  res.json(updated);
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
    select: { id: true, name: true, email: true, apiKey: true, password: true, role: true, plan: true, status: true, botName: true, language: true },
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

  if (merchant.status === 'suspended') {
    res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
    return;
  }

  const { password: _pw, ...safe } = merchant;
  res.json(safe);
}

const forgotPasswordSchema = z.object({ email: z.string().email() });

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const result = forgotPasswordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'A valid email is required' });
    return;
  }

  const { email } = result.data;
  const merchant = await prisma.merchant.findUnique({ where: { email }, select: { id: true } });

  // Always respond 200 to avoid leaking which emails exist.
  if (merchant) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { merchantId: merchant.id, tokenHash, expiresAt },
    });

    const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;
    const mail = passwordResetEmail(resetUrl);
    await sendEmail({ to: email, ...mail });
  }

  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
}

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { token, newPassword } = result.data;
  const tokenHash = hashToken(token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { id: true, merchantId: true, expiresAt: true, usedAt: true },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    res.status(400).json({ error: 'This reset link is invalid or has expired.' });
    return;
  }

  await prisma.$transaction([
    prisma.merchant.update({
      where: { id: record.merchantId },
      data: { password: await bcrypt.hash(newPassword, 12) },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  res.json({ success: true });
}
