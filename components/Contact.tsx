"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/language";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY_FORM = { name: "", email: "", company: "", message: "" };

export default function Contact() {
  const { lang, t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [serviceIdx, setServiceIdx] = useState<number | "">("");
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    if (!slug) return;
    const idx = t.services.items.findIndex((s) => s.slug === slug);
    if (idx >= 0) setServiceIdx(idx);
  }, [t]);

  const setField = (field: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          service: serviceIdx === "" ? "" : t.contact.serviceOptions[lang][serviceIdx],
          lang,
          origin: window.location.origin,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setForm(EMPTY_FORM);
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-mist placeholder:text-mist/35 outline-none transition-all focus:border-brand-purple/60 focus:bg-white/[0.07] focus:shadow-glow sm:text-sm";

  return (
    <section id="contact" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="orb absolute -bottom-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-purple/12 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <Reveal>
            <p className="font-mono text-xs tracking-[0.35em] text-brand-light uppercase">
              {t.contact.tag[lang]}
            </p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
              {t.contact.title[lang]}{" "}
              <span className="text-gradient">{t.contact.titleAccent[lang]}</span>
            </h2>
            <p className="mt-5 max-w-md text-lg font-light text-mist/60">
              {t.contact.subtitle[lang]}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-10 flex flex-col gap-4">
              <a
                href="mailto:contact@tribai.site"
                className="glass group flex items-center gap-3.5 rounded-2xl px-5 py-4 transition-all hover:border-brand-purple/50 sm:gap-4 sm:px-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/30 to-brand-dark/40 text-brand-light transition-all group-hover:shadow-glow">
                  <Icon name="mail" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-mist/45 uppercase">
                    Email
                  </p>
                  <p className="truncate font-medium text-white">contact@tribai.site</p>
                </div>
              </a>
              <div className="glass flex items-center gap-3.5 rounded-2xl px-5 py-4 sm:gap-4 sm:px-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/30 to-brand-dark/40 text-brand-light">
                  <Icon name="pin" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-mist/45 uppercase">
                    HQ
                  </p>
                  <p className="font-medium text-white">{t.contact.location[lang]}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <form onSubmit={handleSubmit} className="card-border rounded-2xl p-6 sm:p-10">
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={setField("company")}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-mist/50 uppercase">
                  {t.contact.name[lang]}
                </label>
                <input
                  id="contact-name"
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={setField("name")}
                  maxLength={120}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-mist/50 uppercase">
                  {t.contact.email[lang]}
                </label>
                <input
                  id="contact-email"
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={setField("email")}
                  maxLength={200}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="contact-service" className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-mist/50 uppercase">
                {t.contact.service[lang]}
              </label>
              <select
                id="contact-service"
                required
                name="service"
                value={serviceIdx}
                onChange={(e) =>
                  setServiceIdx(e.target.value === "" ? "" : Number(e.target.value))
                }
                className={inputClass}
              >
                <option value="" disabled>
                  —
                </option>
                {t.contact.serviceOptions[lang].map((opt, i) => (
                  <option key={i} value={i} className="bg-abyss text-mist">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5">
              <label htmlFor="contact-message" className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-mist/50 uppercase">
                {t.contact.message[lang]}
              </label>
              <textarea
                id="contact-message"
                required
                name="message"
                value={form.message}
                onChange={setField("message")}
                maxLength={5000}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="btn-primary mt-7 w-full rounded-xl bg-gradient-to-r from-brand-dark via-brand-purple to-brand-dark bg-[length:200%_auto] py-4 font-display text-sm font-bold tracking-widest text-white uppercase shadow-glow transition-all hover:bg-right hover:shadow-glow-lg disabled:opacity-70"
            >
              {status === "sending"
                ? t.contact.sending[lang]
                : status === "sent"
                  ? "✓"
                  : t.contact.send[lang]}
            </button>
            {status === "sent" && (
              <div className="msg-in mt-4 space-y-1.5 text-center text-sm text-emerald-400">
                <p>{t.contact.sent[lang]}</p>
                <p>{t.contact.sentConfirm[lang]}</p>
              </div>
            )}
            {status === "error" && (
              <p className="msg-in mt-4 text-center text-sm text-rose-400" role="alert">
                {t.contact.error[lang]}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
