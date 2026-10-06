"use client";

import Link from "next/link";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/language";

export default function Services() {
  const { lang, t } = useLanguage();

  return (
    <section id="services" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-brand-purple/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.35em] text-brand-light uppercase">
                {t.services.tag[lang]}
              </p>
              <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
                {t.services.title[lang]}{" "}
                <span className="text-gradient">{t.services.titleAccent[lang]}</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg font-light text-mist/60">
                {t.services.subtitle[lang]}
              </p>
            </div>
            <div className="flex items-center gap-4 border-l border-brand-purple/40 pl-5">
              <span className="font-display text-4xl font-black text-white">
                {String(t.services.items.length).padStart(2, "0")}
              </span>
              <span className="max-w-24 font-mono text-[10px] leading-relaxed tracking-[0.2em] text-mist/50 uppercase">
                {t.nav.allServices[lang]}
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((service, i) => (
            <Reveal key={service.icon} delay={(i % 3) * 120}>
              <Link
                href={`/services/${service.slug}`}
                className="card-border group block h-full rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-glow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/25 to-brand-dark/40 text-brand-light transition-all duration-500 group-hover:from-brand-purple group-hover:to-brand-dark group-hover:text-white group-hover:shadow-glow">
                  <Icon name={service.icon} />
                </div>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-brand-purple/80">
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-bold tracking-wide text-white">
                    {service.title[lang]}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed font-light text-mist/60">
                  {service.desc[lang]}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-brand-light transition-all duration-300 group-hover:gap-3">
                  {t.services.viewMore[lang]} <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
