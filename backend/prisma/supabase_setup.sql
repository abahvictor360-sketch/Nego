-- Nego Bot — Full Schema Setup
-- Paste this into Supabase → SQL Editor → Run
-- (merchants table may already exist from MCP — IF NOT EXISTS handles that safely)

CREATE TABLE IF NOT EXISTS merchants (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  "apiKey"    TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  "merchantId"  TEXT NOT NULL REFERENCES merchants(id),
  name          TEXT NOT NULL,
  description   TEXT,
  "listPrice"   NUMERIC(10,2) NOT NULL,
  "floorPrice"  NUMERIC(10,2) NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'USD',
  "isActive"    BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id                  TEXT PRIMARY KEY,
  "merchantId"        TEXT NOT NULL REFERENCES merchants(id),
  "productId"         TEXT NOT NULL REFERENCES products(id),
  channel             TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'active',
  "startedAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "endedAt"           TIMESTAMPTZ,
  "finalAgreedPrice"  NUMERIC(10,2),
  "discountPercent"   NUMERIC(5,2),
  "checkoutUrl"       TEXT,
  "customerIdentifier" TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL REFERENCES chat_sessions(id),
  role        TEXT NOT NULL,
  content     TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updatedAt on products
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_products_merchant   ON products("merchantId");
CREATE INDEX IF NOT EXISTS idx_sessions_merchant   ON chat_sessions("merchantId");
CREATE INDEX IF NOT EXISTS idx_sessions_product    ON chat_sessions("productId");
CREATE INDEX IF NOT EXISTS idx_sessions_status     ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_messages_session    ON messages("sessionId");
