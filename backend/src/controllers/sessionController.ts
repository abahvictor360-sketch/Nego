import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { getAnthropicClient } from '../ai/anthropic';
import { buildSystemPrompt } from '../ai/promptBuilder';
import { parseAIResponse, NegotiationResponse } from '../ai/responseParser';
import { generateCheckoutUrl } from '../services/checkoutService';
import { createStripeCheckoutSession, isStripeEnabled } from '../services/stripeService';
import { AuthenticatedRequest } from '../middleware/apiKeyAuth';

const createSessionSchema = z.object({
  productId: z.string().min(1),
  channel: z.enum(['web', 'mobile', 'instore_qr']).default('web'),
  customerIdentifier: z.string().optional(),
  storeUrl: z.string().url('storeUrl must be a valid URL').optional(),
});

const sendMessageSchema = z.object({
  message: z.string().min(1).max(2000),
});

export async function createSession(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = createSessionSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { productId, channel, customerIdentifier } = result.data;

  const product = await prisma.product.findFirst({
    where: { id: productId, merchantId: req.merchant!.id, isActive: true },
    select: { id: true, name: true, listPrice: true, currency: true },
  });

  if (!product) {
    res.status(404).json({ error: 'Product not found or inactive' });
    return;
  }

  const session = await prisma.chatSession.create({
    data: { merchantId: req.merchant!.id, productId, channel, customerIdentifier },
    select: { id: true, productId: true, channel: true, status: true, startedAt: true },
  });

  res.status(201).json({
    ...session,
    product: { name: product.name, listPrice: product.listPrice, currency: product.currency },
  });
}

export async function sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const sessionId = req.params.id as string;

  const result = sendMessageSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, merchantId: req.merchant!.id },
    include: {
      product: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  if (session.status !== 'active') {
    res.status(409).json({ error: `Session is already ${session.status}` });
    return;
  }

  const { message } = result.data;

  // Persist the user's message first
  await prisma.message.create({ data: { sessionId, role: 'user', content: message } });

  // Build conversation history for Anthropic
  const systemPrompt = buildSystemPrompt(
    session.product,
    req.merchant!.botName,
    req.merchant!.language,
  );
  const history = session.messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const anthropic = getAnthropicClient();
  const completion = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    system: systemPrompt,
    messages: [
      ...history,
      { role: 'user', content: message },
    ],
    max_tokens: 300,
  });

  const firstBlock = completion.content[0];
  const rawAI = (firstBlock?.type === 'text' ? firstBlock.text : null)
    ?? '{"status":"countering","message":"Let me think about that."}';

  let parsed = parseAIResponse(rawAI);

  // ─── FLOOR PRICE GUARD ───────────────────────────────────────────────────────
  // The AI never knows floorPrice. If a prompt-injection attack or hallucination
  // produces an agreed price below the floor, we silently correct it to a counter.
  if (parsed.status === 'agreed') {
    const agreedPrice = parsed.price ?? 0;
    const floorPrice = Number(session.product.floorPrice);

    if (agreedPrice < floorPrice) {
      const correctedMessage = `I can offer you ${session.product.currency} ${floorPrice.toFixed(2)} — that's my absolute best price.`;
      parsed = { status: 'countering', message: correctedMessage };
    }
  }
  // ─────────────────────────────────────────────────────────────────────────────

  // Persist the (potentially corrected) assistant message
  const contentToSave = parsed.status === 'countering' && rawAI !== JSON.stringify(parsed)
    ? JSON.stringify(parsed)
    : rawAI;
  await prisma.message.create({ data: { sessionId, role: 'assistant', content: contentToSave } });

  // Handle terminal states
  if (parsed.status === 'agreed') {
    const agreedPrice = parsed.price!;
    const listPrice = Number(session.product.listPrice);
    const discountPercent = ((listPrice - agreedPrice) / listPrice) * 100;

    let checkoutUrl: string;

    if (isStripeEnabled()) {
      const appUrl = process.env.DEFAULT_STORE_URL ?? 'https://your-store.com';
      const stripeUrl = await createStripeCheckoutSession({
        productName: session.product.name,
        currency: session.product.currency,
        agreedPrice,
        sessionId,
        successUrl: appUrl,
        cancelUrl: appUrl,
      });
      checkoutUrl = stripeUrl ?? appUrl;
    } else {
      const storeUrl = (req.body.storeUrl as string | undefined)
        ?? process.env.DEFAULT_STORE_URL
        ?? 'https://your-store.com';
      checkoutUrl = generateCheckoutUrl({ storeUrl, productId: session.productId, agreedPrice, sessionId });
    }

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { status: 'agreed', finalAgreedPrice: agreedPrice, discountPercent, checkoutUrl, endedAt: new Date() },
    });

    res.json({ status: 'agreed', message: parsed.message, agreedPrice, checkoutUrl });
    return;
  }

  if (parsed.status === 'rejected') {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { status: 'rejected', endedAt: new Date() },
    });
  }

  res.json({ status: parsed.status, message: parsed.message });
}

export async function getSession(req: AuthenticatedRequest, res: Response): Promise<void> {
  const session = await prisma.chatSession.findFirst({
    where: { id: req.params.id as string, merchantId: req.merchant!.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      product: { select: { name: true, listPrice: true, currency: true } },
    },
    // floorPrice is NOT in the select — it stays server-side only
  });

  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  res.json(session);
}

export async function listSessions(req: AuthenticatedRequest, res: Response): Promise<void> {
  const sessions = await prisma.chatSession.findMany({
    where: { merchantId: req.merchant!.id },
    orderBy: { startedAt: 'desc' },
    take: 50,
    select: {
      id: true, productId: true, channel: true, status: true,
      startedAt: true, endedAt: true, finalAgreedPrice: true, discountPercent: true,
      customerIdentifier: true,
      product: { select: { name: true, listPrice: true, currency: true } },
    },
  });

  res.json(sessions);
}
