"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useLanguage } from "@/lib/language";
import type { Lang } from "@/lib/content";

function USFlag() {
  return (
    <svg viewBox="0 0 20 14" className="h-full w-full" aria-hidden="true">
      <rect width="20" height="14" fill="#ffffff" />
      {[0, 2.15, 4.31, 6.46, 8.62, 10.77, 12.92].map((y) => (
        <rect key={y} y={y} width="20" height="1.08" fill="#B22234" />
      ))}
      <rect width="8" height="7.54" fill="#3C3B6E" />
      {[1.3, 3.77, 6.24].map((cy) =>
        [1.1, 2.95, 4.8, 6.65].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.42" fill="#ffffff" />
        ))
      )}
    </svg>
  );
}

function ESFlag() {
  return (
    <svg viewBox="0 0 20 14" className="h-full w-full" aria-hidden="true">
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </svg>
  );
}

function FlagBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-white/25">
      {children}
    </span>
  );
}

const LANGUAGES: Record<Lang, { name: string; initials: string; flag: React.ReactNode }> = {
  en: { name: "English", initials: "EN", flag: <USFlag /> },
  es: { name: "Español", initials: "ES", flag: <ESFlag /> },
};

export default function LanguageSwitcher({
  align = "right",
  direction = "down",
}: {
  align?: "left" | "right";
  direction?: "down" | "up";
}) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const current = LANGUAGES[lang];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className={`glass flex items-center gap-2 rounded-full px-3.5 py-2 transition-all hover:border-brand-purple/50 ${
          open ? "border-brand-purple/60 text-brand-light" : "text-mist"
        }`}
      >
        <FlagBadge>{current.flag}</FlagBadge>
        <span className="font-mono text-[11px] font-bold tracking-[0.2em]">{current.initials}</span>
        <span
          className={`font-mono text-[10px] text-mist/60 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          ↓
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language"
          className={`msg-in absolute w-48 rounded-2xl border border-white/10 bg-abyss/95 p-2 shadow-card backdrop-blur-2xl ${
            align === "right" ? "right-0" : "left-0"
          } ${direction === "up" ? "bottom-[calc(100%+10px)]" : "top-[calc(100%+10px)]"}`}
        >
          <p className="px-3 pb-1.5 pt-1 font-mono text-[10px] tracking-[0.24em] text-brand-light uppercase">
            // Language
          </p>
          {(Object.keys(LANGUAGES) as Lang[]).map((code) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={lang === code}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5"
            >
              <FlagBadge>{LANGUAGES[code].flag}</FlagBadge>
              <span
                className={`flex-1 text-sm ${
                  lang === code ? "font-semibold text-white" : "font-light text-mist/75"
                }`}
              >
                {LANGUAGES[code].name}
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-mist/50">
                {LANGUAGES[code].initials}
              </span>
              {lang === code && <Icon name="check" className="h-3.5 w-3.5 text-brand-light" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
