export type NegotiationStatus = 'countering' | 'agreed' | 'rejected';

export interface NegotiationResponse {
  status: NegotiationStatus;
  message: string;
  price?: number;
  product_id?: string;
}

export function parseAIResponse(raw: string): NegotiationResponse {
  // Strip markdown code fences GPT sometimes adds despite instructions
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { status: 'countering', message: cleaned.slice(0, 500) };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { status: 'countering', message: String(parsed).slice(0, 500) };
  }

  const obj = parsed as Record<string, unknown>;
  const status = obj.status as string;

  if (!['countering', 'agreed', 'rejected'].includes(status)) {
    return { status: 'countering', message: String(obj.message ?? cleaned) };
  }

  return {
    status: status as NegotiationStatus,
    message: String(obj.message ?? ''),
    price: obj.price !== undefined ? Number(obj.price) : undefined,
    product_id: obj.product_id !== undefined ? String(obj.product_id) : undefined,
  };
}
