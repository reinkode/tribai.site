"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";

export default function HeroChat() {
  const { lang, t } = useLanguage();
  const script = t.hero.script;

  const [revealed, setRevealed] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setRevealed(0);
    setTyping(false);
  }, [lang]);

  useEffect(() => {
    if (revealed >= script.length) {
      const loop = window.setTimeout(() => setRevealed(0), 18000);
      return () => window.clearTimeout(loop);
    }
    const next = script[revealed];
    const timers: number[] = [];
    if (next.role === "ai") {
      timers.push(window.setTimeout(() => setTyping(true), 400));
      timers.push(
        window.setTimeout(() => {
          setTyping(false);
          setRevealed((r) => r + 1);
        }, 1800)
      );
    } else {
      timers.push(
        window.setTimeout(() => setRevealed((r) => r + 1), 1000)
      );
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [revealed, lang, script.length]);

  return (
    <div className="scanline card-border relative w-full overflow-hidden rounded-2xl shadow-glow-lg">
      {/* window chrome */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-purple to-brand-dark">
            <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-xs font-bold tracking-widest text-white">
              {t.hero.chatTitle[lang]}
            </p>
            <p className="flex items-center gap-1.5 text-[10px] text-mist/50">
              <span className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
              <span className="truncate">{t.hero.chatStatus[lang]}</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-purple/70" />
        </div>
      </div>

      {/* messages */}
      <div className="flex h-[280px] flex-col gap-3 overflow-hidden bg-gradient-to-b from-abyss to-void px-4 py-5 sm:h-[340px] sm:px-5 lg:h-[380px]">
        {script.slice(0, revealed).map((msg, i) => (
          <div
            key={`${lang}-${i}`}
            className={`msg-in flex items-end gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {msg.role === "ai" ? (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-purple to-brand-dark">
                <img src="/logo.png" alt="" className="h-5 w-5 object-contain" />
              </div>
            ) : (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-[10px] font-bold text-mist">
                YOU
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "rounded-bl-sm border border-brand-purple/25 bg-brand-purple/10 text-mist"
                  : "rounded-br-sm bg-gradient-to-br from-brand-purple to-brand-dark text-white shadow-glow"
              } ${i === revealed - 1 && msg.role === "ai" ? "caret" : ""}`}
            >
              {msg.text[lang]}
            </div>
          </div>
        ))}

        {typing && (
          <div className="msg-in flex items-end gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-purple to-brand-dark">
              <img src="/logo.png" alt="" className="h-5 w-5 object-contain" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-brand-purple/25 bg-brand-purple/10 px-4 py-3.5">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-light" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-light" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-light" />
            </div>
          </div>
        )}
      </div>

      {/* fake input */}
      <div className="flex items-center gap-3 border-t border-white/10 bg-black/40 px-4 py-3.5 sm:px-5">
        <div className="min-w-0 flex-1 truncate rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-mist/35">
          {t.hero.chatInput[lang]}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-dark shadow-glow">
          <svg
            className="h-4 w-4 -rotate-45 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
