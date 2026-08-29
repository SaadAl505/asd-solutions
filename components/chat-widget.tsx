"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/logo";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "ما هي خدماتكم؟",
  "كم أسعار الباقات؟",
  "كيف أطلب موقعًا لنشاطي؟",
];

export default function ChatWidget({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: data.reply || "حدث خطأ، يرجى المحاولة مرة أخرى." },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "تعذّر الاتصال، يرجى المحاولة مرة أخرى." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* زر المساعد العائم */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "إغلاق المساعد الذكي" : "فتح المساعد الذكي"}
        className="chat-fab"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 12a8 8 0 0 1-11.6 7.2L4 21l1.8-5.4A8 8 0 1 1 21 12z" />
            <path d="M12 7.5l1.2 2.6 2.6 1.2-2.6 1.2L12 15.1l-1.2-2.6-2.6-1.2 2.6-1.2z" fill="#fff" stroke="none" />
          </svg>
        )}
        {!open && <span className="chat-fab-pulse" aria-hidden />}
      </button>

      {/* نافذة المحادثة */}
      {open && (
        <div className="chat-panel" role="dialog" aria-label="المساعد الذكي">
          <div className="chat-head">
            <LogoMark size={34} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--ink)" }}>المساعد الذكي</div>
              <div style={{ fontSize: 11.5, color: "var(--accent)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
                متصل الآن — {siteName}
              </div>
            </div>
          </div>

          <div className="chat-list" ref={listRef}>
            <div className="chat-bubble bot">
              أهلًا بك في {siteName} 👋
              <br />
              أنا مساعدك الذكي — اسألني عن خدماتنا وأسعارنا وعروضنا وسأجيبك فورًا.
            </div>

            {messages.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="chat-suggest" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role === "user" ? "user" : "bot"}`}>
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble bot" aria-label="جارٍ الكتابة">
                <span className="dots"><i /><i /><i /></span>
              </div>
            )}
          </div>

          <form
            className="chat-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              className="chat-input"
              placeholder="اكتب سؤالك هنا..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
            />
            <button type="submit" className="chat-send" disabled={loading || !input.trim()} aria-label="إرسال">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden style={{ transform: "scaleX(-1)" }}>
                <path d="M2.7 20.6 22 12 2.7 3.4l-.1 6.9L15 12 2.6 13.7z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <style>{`
        .chat-fab {
          position: fixed; bottom: 88px; inset-inline-start: 22px; z-index: 70;
          width: 54px; height: 54px; border-radius: 50%; border: 0; cursor: pointer;
          background: var(--grad); display: grid; place-items: center;
          box-shadow: 0 12px 30px -8px rgba(56, 189, 248, 0.55);
          transition: transform .2s ease;
        }
        .chat-fab:hover { transform: translateY(-3px); }
        .chat-fab-pulse {
          position: absolute; inset: -4px; border-radius: 50%;
          border: 2px solid rgba(56, 189, 248, 0.5);
          animation: chat-pulse 2.2s ease-out infinite;
        }
        @keyframes chat-pulse {
          0% { transform: scale(.9); opacity: 1; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .chat-panel {
          position: fixed; bottom: 152px; inset-inline-start: 22px; z-index: 70;
          width: min(370px, calc(100vw - 44px)); height: min(520px, 70vh);
          display: flex; flex-direction: column;
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 30px 70px -20px rgba(0,0,0,.6);
          animation: chat-in .25s cubic-bezier(.16,1,.3,1);
        }
        @keyframes chat-in { from { opacity: 0; transform: translateY(16px) scale(.97); } }
        .chat-head {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }
        .chat-list {
          flex: 1; overflow-y: auto; padding: 16px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .chat-bubble {
          max-width: 85%; padding: 10px 14px; border-radius: 16px;
          font-size: 13.5px; line-height: 1.8; white-space: pre-wrap;
        }
        .chat-bubble.bot {
          align-self: flex-start;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--ink);
          border-start-start-radius: 4px;
        }
        .chat-bubble.user {
          align-self: flex-end;
          background: var(--grad);
          color: #fff;
          border-start-end-radius: 4px;
        }
        .chat-suggest {
          border: 1px solid var(--border-strong); background: transparent;
          color: var(--ink-2); font-family: inherit; font-size: 12.5px; font-weight: 600;
          padding: 7px 14px; border-radius: 999px; cursor: pointer;
          transition: color .2s ease, border-color .2s ease;
        }
        .chat-suggest:hover { color: var(--accent); border-color: var(--accent); }
        .chat-input-row {
          display: flex; gap: 8px; padding: 12px;
          background: var(--surface);
          border-top: 1px solid var(--border);
        }
        .chat-input {
          flex: 1; background: var(--bg); border: 1px solid var(--border);
          border-radius: 12px; padding: 10px 14px;
          font-family: inherit; font-size: 13.5px; color: var(--ink);
        }
        .chat-input:focus { outline: none; border-color: var(--accent); }
        .chat-send {
          width: 42px; border: 0; border-radius: 12px; cursor: pointer;
          background: var(--grad); display: grid; place-items: center;
          transition: opacity .2s ease;
        }
        .chat-send:disabled { opacity: .45; cursor: default; }
        .dots { display: inline-flex; gap: 4px; }
        .dots i {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          animation: dot-bounce 1.2s ease-in-out infinite;
        }
        .dots i:nth-child(2) { animation-delay: .15s; }
        .dots i:nth-child(3) { animation-delay: .3s; }
        @keyframes dot-bounce { 0%, 60%, 100% { transform: none; opacity: .5; } 30% { transform: translateY(-4px); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .chat-fab-pulse, .dots i { animation: none; }
        }
      `}</style>
    </>
  );
}
