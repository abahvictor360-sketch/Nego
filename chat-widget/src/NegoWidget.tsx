import { useState, useRef, useEffect, useCallback } from 'react';
import { createSession, sendMessage } from './lib/api';
import type { Session, MessageResponse } from './lib/api';

export interface NegoWidgetProps {
  apiUrl: string;
  apiKey: string;
  productId: string;
  channel?: 'web' | 'mobile' | 'instore_qr';
  storeUrl?: string;
  accentColor?: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

type WidgetStatus = 'idle' | 'countering' | 'agreed' | 'rejected' | 'error';

export default function NegoWidget({
  apiUrl,
  apiKey,
  productId,
  channel = 'web',
  storeUrl,
  accentColor = '#7c3aed',
}: NegoWidgetProps) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [widgetStatus, setWidgetStatus] = useState<WidgetStatus>('idle');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const initSession = useCallback(async () => {
    try {
      const s = await createSession(apiUrl, apiKey, productId, channel);
      setSession(s);
      const price = parseFloat(s.product.listPrice).toFixed(2);
      setMessages([{
        role: 'assistant',
        text: `Hi! I'm Abah, your negotiation assistant. The ${s.product.name} is listed at ${s.product.currency} ${price}. Make me an offer and let's see if we can make a deal!`,
      }]);
    } catch {
      setInitError('Could not connect to negotiation service. Please try again.');
    }
  }, [apiUrl, apiKey, productId, channel]);

  useEffect(() => {
    if (open && !session && !initError) {
      initSession();
    }
  }, [open, session, initError, initSession]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || !session || loading || widgetStatus === 'agreed' || widgetStatus === 'rejected') return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const resp: MessageResponse = await sendMessage(apiUrl, apiKey, session.id, userMsg, storeUrl);
      setMessages(prev => [...prev, { role: 'assistant', text: resp.message }]);
      setWidgetStatus(resp.status);
      if (resp.status === 'agreed' && resp.checkoutUrl) {
        setCheckoutUrl(resp.checkoutUrl);
        setTimeout(() => { window.location.href = resp.checkoutUrl!; }, 3000);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const isDone = widgetStatus === 'agreed' || widgetStatus === 'rejected';

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3 font-sans">
      {/* Chat panel */}
      {open && (
        <div className="w-80 sm:w-96 rounded-2xl shadow-2xl bg-white flex flex-col overflow-hidden border border-gray-200"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 text-white"
            style={{ background: accentColor }}>
            <div>
              <p className="font-semibold text-sm leading-tight">Negotiate Price</p>
              {session && (
                <p className="text-xs opacity-80 mt-0.5">{session.product.name}</p>
              )}
            </div>
            <button onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white transition-colors leading-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50">
            {initError ? (
              <p className="text-red-500 text-sm text-center mt-4">{initError}</p>
            ) : messages.length === 0 ? (
              <div className="flex gap-2 mt-4 justify-center">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                  }`}
                    style={msg.role === 'user' ? { background: accentColor } : {}}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* Agreed banner */}
            {widgetStatus === 'agreed' && checkoutUrl && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-green-700 font-semibold text-sm flex items-center justify-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                  Deal reached!
                </p>
                <p className="text-green-600 text-xs mt-1">Redirecting to checkout in 3 seconds…</p>
                <a href={checkoutUrl}
                  className="inline-block mt-2 text-xs text-white px-3 py-1.5 rounded-lg"
                  style={{ background: accentColor }}>
                  Go to checkout
                </a>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isDone || loading || !session}
              placeholder={isDone ? 'Negotiation ended' : 'Type your offer…'}
              className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-violet-400 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isDone || loading || !session || !input.trim()}
              className="text-white rounded-xl px-3 py-2 text-sm font-medium disabled:opacity-40 transition-opacity"
              style={{ background: accentColor }}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-full shadow-lg text-white flex items-center justify-center text-2xl transition-transform hover:scale-105 active:scale-95"
        style={{ background: accentColor }}
        aria-label="Open price negotiator">
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>
    </div>
  );
}
