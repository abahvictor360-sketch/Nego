/**
 * Pluggable email service.
 *
 * Configuration is read from the database (PlatformSetting → email), so a
 * platform admin can manage SMTP/Resend settings from the dashboard with no
 * redeploy. Environment variables act as the initial fallback. If nothing is
 * configured (or the provider fails) emails are logged to the console so the
 * whole flow keeps working end-to-end.
 */
import { prisma } from './prisma';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailConfig {
  provider: 'log' | 'smtp' | 'resend';
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  resendApiKey: string;
}

function envDefaults(): EmailConfig {
  return {
    provider: (process.env.EMAIL_PROVIDER as EmailConfig['provider']) ?? 'log',
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.EMAIL_FROM ?? 'Nego Bot <noreply@nego.bot>',
    resendApiKey: process.env.RESEND_API_KEY ?? '',
  };
}

/** Load the effective email config (DB overrides env). */
export async function getEmailConfig(): Promise<EmailConfig> {
  const defaults = envDefaults();
  try {
    const row = await prisma.platformSetting.findUnique({ where: { id: 'default' } });
    const saved = (row?.data as { email?: Partial<EmailConfig> })?.email;
    if (saved) return { ...defaults, ...saved };
  } catch { /* fall back to env */ }
  return defaults;
}

async function sendViaSmtp(cfg: EmailConfig, payload: EmailPayload): Promise<void> {
  if (!cfg.host) throw new Error('SMTP host is not configured');
  // Dynamic import so the app still boots if nodemailer isn't installed yet.
  let nodemailer: typeof import('nodemailer');
  try {
    nodemailer = await import('nodemailer');
  } catch {
    throw new Error('nodemailer is not installed — run `npm install` in backend');
  }
  const transport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure, // true for 465, false for 587/STARTTLS
    auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
  });
  await transport.sendMail({
    from: cfg.from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}

async function sendViaResend(cfg: EmailConfig, payload: EmailPayload): Promise<void> {
  if (!cfg.resendApiKey) throw new Error('Resend API key is not configured');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: cfg.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
}

function logEmail(payload: EmailPayload): void {
  console.log('\n────────────── EMAIL (logging only) ──────────────');
  console.log(`To:      ${payload.to}`);
  console.log(`Subject: ${payload.subject}`);
  console.log(`\n${payload.text ?? payload.html.replace(/<[^>]+>/g, '')}`);
  console.log('───────────────────────────────────────────────────\n');
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const cfg = await getEmailConfig();
  try {
    if (cfg.provider === 'smtp') return await sendViaSmtp(cfg, payload);
    if (cfg.provider === 'resend') return await sendViaResend(cfg, payload);
  } catch (err) {
    // Never crash on a mail failure — log and fall through.
    console.error('[EMAIL] provider failed, falling back to log:', (err as Error).message);
  }
  logEmail(payload);
}

export function passwordResetEmail(resetUrl: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Reset your Nego Bot password',
    text: `You requested a password reset.\n\nReset your password using this link (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#6d28d9">Reset your password</h2>
        <p>You requested a password reset for your Nego Bot account.</p>
        <p><a href="${resetUrl}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Reset Password</a></p>
        <p style="color:#6b7280;font-size:13px">This link is valid for 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>`,
  };
}
