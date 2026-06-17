import Stripe from 'stripe';

type StripeClient = InstanceType<typeof Stripe>;

let _stripe: StripeClient | null = null;

function getStripe(): StripeClient | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}

export interface StripeCheckoutParams {
  productName: string;
  currency: string;
  agreedPrice: number;
  sessionId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createStripeCheckoutSession(
  params: StripeCheckoutParams,
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const { productName, currency, agreedPrice, sessionId, successUrl, cancelUrl } = params;

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: Math.round(agreedPrice * 100),
          product_data: {
            name: productName,
            description: `Negotiated price via Nego Bot (session ${sessionId.slice(-8)})`,
          },
        },
      },
    ],
    success_url: `${successUrl}?nego_session=${sessionId}&nego_status=success`,
    cancel_url: cancelUrl,
    metadata: { nego_session_id: sessionId },
  });

  return checkout.url;
}

export function isStripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
