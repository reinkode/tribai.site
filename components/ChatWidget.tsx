"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language";

interface Msg {
  role: "user" | "ai";
  text: string;
}

// No real assistant backend yet — the widget renders an offline shell until one is wired.
const ASSISTANT_LIVE = false;

export default function ChatWidget() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ASSISTANT_LIVE && open && msgs.length === 0) {
      setTyping(true);
      const id = setTimeout(() => {
        setMsgs([{ role: "ai", text: t.widget.greeting[lang] }]);
        setTyping(false);
      }, 800);
      return () => clearTimeout(id);
    }
  }, [open, msgs.length, lang, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  const respond = (question: string) => {
    const q = question.toLowerCase();
    const best = t.widget.responses.find((r) =>
      r.match[lang].some((k) => q.includes(k.toLowerCase()))
    );
    return best ? best.reply[lang] : t.widget.fallback[lang];
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMsgs((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: respond(trimmed) }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <>
      {/* launcher */}
      {ASSISTANT_LIVE ? (
        <button
          onClick={() => setOpen(!open)}
          aria-label={t.widget.launcher[lang]}
          className="group fixed right-6 bottom-6 z-40 flex items-center rounded-full border border-brand-purple/40 bg-gradient-to-br from-brand-purple to-brand-dark p-3 text-white shadow-glow-lg transition-all duration-300 hover:scale-105 hover:shadow-glow"
        >
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15">
            <img src="/logo.png" alt="" className="h-6 w-6 object-contain" />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap font-display text-xs font-bold tracking-widest uppercase opacity-0 transition-all duration-300 group-focus:ml-3 group-focus:max-w-[12rem] group-focus:opacity-100 group-hover:ml-3 group-hover:max-w-[12rem] group-hover:opacity-100">
            {t.widget.launcher[lang]}
          </span>
          <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full border-2 border-brand-dark bg-emerald-400" />
        </button>
      ) : (
        <button
          disabled
          title={`${t.widget.launcher[lang]} — ${t.widget.offlineBadge[lang]}`}
          className="fixed right-6 bottom-6 z-40 flex h-14 w-14 cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-card"
        >
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/10">
            <img src="/logo.png" alt="" className="h-6 w-6 object-contain opacity-50 grayscale" />
          </span>
          <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full border-2 border-void bg-red-400" />
        </button>
      )}

      {/* panel */}
      {open && (
        <div className="card-border fixed inset-x-3 top-20 bottom-3 z-40 flex flex-col overflow-hidden rounded-2xl shadow-glow-lg sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-24 sm:h-[min(30rem,calc(100dvh-8rem))] sm:w-[calc(100vw-3rem)] sm:max-w-sm">
          <div className="flex items-center gap-3 border-b border-white/10 bg-black/40 px-4 py-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-purple to-brand-dark">
              <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xs font-bold tracking-widest text-white">
                {t.widget.title[lang]}
              </p>
              <p className="truncate text-[10px] text-mist/50">{t.widget.subtitle[lang]}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-mist/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-abyss to-void px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={`msg-in flex ${m.role === "user" ? "justify-end" : ""}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === "ai"
                      ? "rounded-bl-sm border border-brand-purple/25 bg-brand-purple/10 text-mist"
                      : "rounded-br-sm bg-gradient-to-br from-brand-purple to-brand-dark text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="msg-in flex">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-brand-purple/25 bg-brand-purple/10 px-4 py-3">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-light" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-light" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-light" />
                </div>
              </div>
            )}
          </div>

          {msgs.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-white/5 bg-black/30 px-4 py-3">
              {t.widget.suggestions[lang].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-brand-purple/40 bg-brand-purple/10 px-3 py-1.5 text-[11px] font-medium text-brand-light transition-all hover:bg-brand-purple/25"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-black/40 px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.widget.placeholder[lang]}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-base text-mist outline-none placeholder:text-mist/35 focus:border-brand-purple/60 sm:text-sm"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-dark text-white shadow-glow transition-transform hover:scale-105"
            >
              <svg className="h-4 w-4 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
