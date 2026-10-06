"use client";

import Link from "next/link";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/language";

export default function ServiceOverview() {
  const { lang, t } = useLanguage();

  return (
    <section id="service-overview" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute top-1/3 -right-48 h-96 w-96 rounded-full bg-brand-dark/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-[0.35em] text-brand-light uppercase">
              {t.serviceOverview.tag[lang]}
            </p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
              {t.serviceOverview.title[lang]}{" "}
              <span className="text-gradient">{t.serviceOverview.titleAccent[lang]}</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed font-light text-mist/60">
              {t.serviceOverview.subtitle[lang]}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {t.serviceOverview.pillars.map((pillar, i) => {
            const services = pillar.serviceSlugs.flatMap((slug) => {
              const service = t.services.items.find((item) => item.slug === slug);
              return service ? [service] : [];
            });

            return (
              <Reveal key={pillar.code} delay={i * 110}>
                <article className="enterprise-panel group h-full rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.28em] text-brand-light">
                      /{pillar.code}
                    </span>
                    <span className="rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-brand-light uppercase">
                      {pillar.label[lang]}
                    </span>
                  </div>

                  <h3 className="mt-9 max-w-sm font-display text-2xl font-bold tracking-tight text-white">
                    {pillar.title[lang]}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed font-light text-mist/60">
                    {pillar.desc[lang]}
                  </p>

                  <div className="mt-8 border-t border-white/10 pt-3">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="group/service flex items-center justify-between gap-4 border-b border-white/10 py-4 transition-colors hover:border-brand-purple/50"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-brand-light transition-colors group-hover/service:bg-brand-purple group-hover/service:text-white">
                            <Icon name={service.icon} className="h-4 w-4" />
                          </span>
                          <span className="font-display text-sm font-bold tracking-wide text-white">
                            {service.title[lang]}
                          </span>
                        </span>
                        <span className="font-mono text-brand-light transition-transform duration-300 group-hover/service:translate-x-1">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
