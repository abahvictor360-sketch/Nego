import crypto from 'crypto';

function getSecret(): string {
  const secret = process.env.CHECKOUT_SECRET;
  if (!secret) throw new Error('CHECKOUT_SECRET is not configured');
  return secret;
}

function sign(productId: string, price: number, sessionId: string): string {
  const payload = `${productId}:${price}:${sessionId}`;
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex').slice(0, 16);
}

/**
 * Builds a WooCommerce-compatible cart URL with an HMAC signature.
 * The WooCommerce side must verify nego_sig before honoring nego_price.
 */
export function generateCheckoutUrl(params: {
  storeUrl: string;
  productId: string;
  agreedPrice: number;
  sessionId: string;
}): string {
  const { storeUrl, productId, agreedPrice, sessionId } = params;
  const sig = sign(productId, agreedPrice, sessionId);

  const base = storeUrl.replace(/\/$/, '');
  return `${base}/?add-to-cart=${encodeURIComponent(productId)}&nego_price=${agreedPrice}&nego_session=${encodeURIComponent(sessionId)}&nego_sig=${sig}`;
}

export function verifyCheckoutSignature(params: {
  productId: string;
  agreedPrice: number;
  sessionId: string;
  sig: string;
}): boolean {
  const expected = sign(params.productId, params.agreedPrice, params.sessionId);
  try {
    return crypto.timingSafeEqual(Buffer.from(params.sig, 'utf8'), Buffer.from(expected, 'utf8'));
  } catch {
    return false;
  }
}
