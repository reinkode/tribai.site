"use client";

import { useLanguage } from "@/lib/language";

export default function Marquee() {
  const { lang, t } = useLanguage();
  const items = t.marquee.items[lang];
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-abyss/70 py-5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-sm font-bold tracking-[0.3em] text-mist/35">
              {item}
            </span>
            <svg className="h-3 w-3 text-brand-purple/70" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0l1.4 4.6L12 6 7.4 7.4 6 12 4.6 7.4 0 6l4.6-1.4L6 0z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
