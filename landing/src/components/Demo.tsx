'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, MessageCircle, PartyPopper } from 'lucide-react';

// Fall back to the live demo merchant/product so the demo works out of the box.
// These are intentionally public demo credentials (read-only negotiation flow).
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://nego-5ykj.onrender.com';
const DEMO_API_KEY = process.env.NEXT_PUBLIC_DEMO_API_KEY ?? 'demo-api-key-3ef9190674d01e3a';
const DEMO_PRODUCT_ID = process.env.NEXT_PUBLIC_DEMO_PRODUCT_ID ?? 'cuid_demo_product_01';

interface Message { role: 'user' | 'assistant'; text: string; }
type Status = 'idle' | 'open' | 'countering' | 'agreed' | 'rejected' | 'error';

export default function Demo() {
  const [status, setStatus] = useState<Status>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [product, setProduct] = useState<{ name: string; price: string }>({ name: 'Premium Widget', price: '100.00' });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function startDemo() {
    if (!DEMO_API_KEY || !DEMO_PRODUCT_ID) {
      setMessages([{
        role: 'assistant',
        text: 'Hi! I\'m Max, your negotiation assistant.\n\nThis is a live demo of Nego Bot. To enable live negotiations, set NEXT_PUBLIC_DEMO_API_KEY and NEXT_PUBLIC_DEMO_PRODUCT_ID.\n\nFor now, try the real app by signing up above!',
      }]);
      setStatus('open');
      return;
    }
    setStatus('open');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': DEMO_API_KEY },
        body: JSON.stringify({ productId: DEMO_PRODUCT_ID, channel: 'web' }),
      });
      const data = await res.json();
      setSessionId(data.id);
      const price = parseFloat(data.product?.listPrice ?? '100').toFixed(2);
      const name = data.product?.name ?? 'Premium Widget';
      setProduct({ name, price });
      setMessages([{
        role: 'assistant',
        text: `Hi! I'm Max. The ${name} is listed at $${price}. Make me an offer and let's see if we can strike a deal!`,
      }]);
    } catch {
      setMessages([{ role: 'assistant', text: "Hi! I'm Max. Unfortunately I can't connect to the demo backend right now. Sign up to try for real!" }]);
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    if (!input.trim() || loading || status === 'agreed' || status === 'rejected') return;
    const msg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    if (!sessionId) { setLoading(false); return; }
    try {
      const res = await fetch(`${BACKEND}/api/sessions/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': DEMO_API_KEY },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', text: data.message }]);
      if (data.status === 'agreed') {
        setStatus('agreed');
        setCheckoutUrl(data.checkoutUrl ?? null);
      } else if (data.status === 'rejected') {
        setStatus('rejected');
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  const isDone = status === 'agreed' || status === 'rejected';

  return (
    <section id="demo" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* Left: copy */}
          <div className="lg:w-1/2">
            <div className="badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> LIVE DEMO
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-5">
              Try it right now.{' '}
              <span className="text-violet-600">Negotiate with Max.</span>
            </h2>
            <p className="text-lg text-gray-500 mb-6 leading-relaxed">
              Max is our AI negotiator. He'll engage you in a real price conversation,
              make counter-offers, and close the deal — all while secretly protecting
              the merchant's floor price.
            </p>
            <ul className="space-y-3">
              {[
                'Start by making a low offer',
                'See how Max counters and defends value',
                'Watch the floor price guard in action',
              ].map(tip => (
                <li key={tip} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0"><ArrowRight className="w-3.5 h-3.5" /></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: chat widget */}
          <div className="lg:w-1/2 w-full">
            <div className="max-w-sm mx-auto">
              {status === 'idle' ? (
                /* Launch button */
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-8 text-center shadow-lg shadow-violet-50">
                  <div className="w-16 h-16 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-300">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Chat with Max</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Our AI negotiator is ready. Try to get a deal below the listed price!
                  </p>
                  <button
                    onClick={startDemo}
                    className="w-full bg-violet-600 text-white font-semibold py-3 rounded-xl hover:bg-violet-700 transition-colors shadow-md shadow-violet-200 inline-flex items-center justify-center gap-2"
                  >
                    Start Negotiating <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Chat window */
                <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-100 overflow-hidden flex flex-col" style={{ height: '480px' }}>
                  {/* Header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-violet-600 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">M</div>
                    <div>
                      <p className="text-sm font-semibold">Max · Nego Bot</p>
                      <p className="text-[11px] text-violet-200">{product.name} · ${product.price}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                          m.role === 'user'
                            ? 'bg-violet-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-3 flex gap-1 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-violet-400 dot1" />
                          <span className="w-2 h-2 rounded-full bg-violet-400 dot2" />
                          <span className="w-2 h-2 rounded-full bg-violet-400 dot3" />
                        </div>
                      </div>
                    )}

                    {status === 'agreed' && checkoutUrl && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                        <p className="text-green-700 font-semibold text-sm inline-flex items-center gap-1.5"><PartyPopper className="w-4 h-4" /> Deal reached!</p>
                        <a href={checkoutUrl} className="inline-block mt-2 bg-green-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg">
                          Complete Purchase
                        </a>
                      </div>
                    )}

                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <div className="px-3 py-2.5 border-t border-gray-100 bg-white flex gap-2">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                      disabled={isDone || loading}
                      placeholder={isDone ? 'Negotiation ended' : 'Make your offer…'}
                      className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 disabled:bg-gray-50 disabled:text-gray-400"
                    />
                    <button
                      onClick={send}
                      disabled={isDone || loading || !input.trim()}
                      className="bg-violet-600 text-white rounded-xl px-3 py-2 text-sm font-semibold disabled:opacity-40 hover:bg-violet-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
