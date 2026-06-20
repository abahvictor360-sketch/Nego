import { Response } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/apiKeyAuth';
import { getEmailConfig, sendEmail } from '../lib/email';

// ─── Email settings ──────────────────────────────────────────────────────────

export async function getEmailSettings(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const cfg = await getEmailConfig();
  // Never return the stored password — only whether one is set.
  const { pass, ...safe } = cfg;
  res.json({ ...safe, passSet: Boolean(pass) });
}

const emailSettingsSchema = z.object({
  provider: z.enum(['log', 'smtp', 'resend']),
  host: z.string().optional().default(''),
  port: z.coerce.number().int().optional().default(587),
  secure: z.boolean().optional().default(false),
  user: z.string().optional().default(''),
  pass: z.string().optional(), // omit/empty = keep existing
  from: z.string().optional().default(''),
  resendApiKey: z.string().optional(), // omit/empty = keep existing
});

export async function updateEmailSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = emailSettingsSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const existing = await getEmailConfig();
  const incoming = result.data;

  // Preserve secrets when the field is left blank on the client.
  const merged = {
    provider: incoming.provider,
    host: incoming.host,
    port: incoming.port,
    secure: incoming.secure,
    user: incoming.user,
    from: incoming.from,
    pass: incoming.pass && incoming.pass.length > 0 ? incoming.pass : existing.pass,
    resendApiKey: incoming.resendApiKey && incoming.resendApiKey.length > 0 ? incoming.resendApiKey : existing.resendApiKey,
  };

  const row = await prisma.platformSetting.findUnique({ where: { id: 'default' } });
  const existingData = (row?.data as Record<string, unknown>) ?? {};
  const nextData = { ...existingData, email: merged } as unknown as Prisma.InputJsonValue;
  await prisma.platformSetting.upsert({
    where: { id: 'default' },
    create: { id: 'default', data: nextData },
    update: { data: nextData },
  });

  const { pass, resendApiKey, ...safe } = merged;
  res.json({ ...safe, passSet: Boolean(pass), resendKeySet: Boolean(resendApiKey) });
}

const testEmailSchema = z.object({ to: z.string().email() });

export async function sendTestEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = testEmailSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'A valid recipient email is required' });
    return;
  }

  try {
    await sendEmail({
      to: result.data.to,
      subject: 'Nego Bot — test email',
      text: 'This is a test email from your Nego Bot platform. If you received this, your email settings are working!',
      html: '<p>This is a <strong>test email</strong> from your Nego Bot platform. If you received this, your email settings are working! 🎉</p>',
    });
    res.json({ success: true, message: 'Test email dispatched. Check the inbox (or server logs if using the log provider).' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
