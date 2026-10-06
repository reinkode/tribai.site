"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language";

type Status = "ok" | "already" | "invalid" | "error";

const STATE_META: Record<Status, { iconClass: string; panelClass: string }> = {
  ok: {
    iconClass: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    panelClass: "border-emerald-400/25",
  },
  already: {
    iconClass: "border-sky-400/40 bg-sky-400/10 text-sky-300",
    panelClass: "border-sky-400/25",
  },
  invalid: {
    iconClass: "border-rose-400/40 bg-rose-400/10 text-rose-300",
    panelClass: "border-rose-400/25",
  },
  error: {
    iconClass: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    panelClass: "border-amber-400/25",
  },
};

const STATE_ICONS: Record<Status, string> = {
  ok: "M5 13l4 4L19 7",
  already: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  invalid: "M6 18L18 6M6 6l12 12",
  error: "M12 9v3m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
};

function isStatus(value: string | undefined): value is Status {
  return value === "ok" || value === "already" || value === "invalid" || value === "error";
}

export function ConfirmationView({ status }: { status?: string }) {
  const { lang, t } = useLanguage();
  const state: Status = isStatus(status) ? status : "invalid";

  const copy = {
    ok: { title: t.confirmation.okTitle[lang], body: t.confirmation.okBody[lang] },
    already: { title: t.confirmation.alreadyTitle[lang], body: t.confirmation.alreadyBody[lang] },
    invalid: { title: t.confirmation.invalidTitle[lang], body: t.confirmation.invalidBody[lang] },
    error: { title: t.confirmation.errorTitle[lang], body: t.confirmation.errorBody[lang] },
  }[state];
  const meta = STATE_META[state];

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div
        className={`enterprise-panel w-full max-w-md rounded-3xl p-10 text-center ${meta.panelClass}`}
      >
        <p className="font-display text-2xl">
          <span className="text-gradient">TribAI</span>
        </p>

        <div
          className={`mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full border ${meta.iconClass}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path d={STATE_ICONS[state]} />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-2xl text-white">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{copy.body}</p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-lg border border-white/15 px-5 py-2.5 text-sm text-white/80 transition hover:border-brand-purple/60 hover:text-white"
        >
          {t.confirmation.backHome[lang]}
        </Link>
      </div>
    </main>
  );
}
