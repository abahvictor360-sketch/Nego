export interface Session {
  id: string;
  product: { name: string; listPrice: string; currency: string };
}

export interface MessageResponse {
  status: 'countering' | 'agreed' | 'rejected';
  message: string;
  agreedPrice?: number;
  checkoutUrl?: string;
}

export async function createSession(
  apiUrl: string,
  apiKey: string,
  productId: string,
  channel: string,
): Promise<Session> {
  const res = await fetch(`${apiUrl}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ productId, channel }),
  });
  if (!res.ok) throw new Error(`Failed to create session: ${res.status}`);
  return res.json();
}

export async function sendMessage(
  apiUrl: string,
  apiKey: string,
  sessionId: string,
  message: string,
  storeUrl?: string,
): Promise<MessageResponse> {
  const res = await fetch(`${apiUrl}/api/sessions/${sessionId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ message, storeUrl }),
  });
  if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
  return res.json();
}
