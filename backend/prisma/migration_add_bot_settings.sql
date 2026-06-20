-- Migration: bot settings, plan/status, password reset, support tickets
-- Run this in your Supabase SQL Editor (or via psql) after deploying the updated schema.

-- 1) Merchant: bot settings + plan/status
ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS role      TEXT NOT NULL DEFAULT 'merchant',
  ADD COLUMN IF NOT EXISTS plan      TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS status    TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS "botName" TEXT NOT NULL DEFAULT 'Max',
  ADD COLUMN IF NOT EXISTS language  TEXT NOT NULL DEFAULT 'en';

-- 2) Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id           TEXT PRIMARY KEY,
  "merchantId" TEXT NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  "tokenHash"  TEXT UNIQUE NOT NULL,
  "expiresAt"  TIMESTAMPTZ NOT NULL,
  "usedAt"     TIMESTAMPTZ,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id           TEXT PRIMARY KEY,
  "merchantId" TEXT NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  subject      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'open',
  priority     TEXT NOT NULL DEFAULT 'normal',
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id           TEXT PRIMARY KEY,
  "ticketId"   TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  "authorRole" TEXT NOT NULL,
  body         TEXT NOT NULL,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id           TEXT PRIMARY KEY,
  "merchantId" TEXT NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  link         TEXT,
  read         BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS notifications_merchant_read_idx ON notifications ("merchantId", read);

-- 5) Platform settings (SMTP / email config, etc.)
CREATE TABLE IF NOT EXISTS platform_settings (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
