import Anthropic from '@anthropic-ai/sdk';

let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set in environment');
    // maxRetries handles transient upstream 429/5xx/overloaded errors with backoff.
    _client = new Anthropic({ apiKey, maxRetries: 4, timeout: 60_000 });
  }
  return _client;
}
