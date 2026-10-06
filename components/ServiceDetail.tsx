"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { getService } from "@/lib/content";
import { useLanguage } from "@/lib/language";

export default function ServiceDetail({ slug }: { slug: string }) {
  const { lang, t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number>(0);
  const service = getService(slug);
  if (!service) return null;
  const page = service.page;
  const related = t.services.items.filter((s) => s.slug !== slug);

  return (
    <main className="relative">
      <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[820px] -translate-x-1/2 rounded-full bg-brand-purple/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6">
          <Reveal>
            <Link
              href="/#services"
              className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-mist/50 uppercase transition-colors hover:text-brand-light"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              {t.servicePage.backToServices[lang]}
            </Link>

            <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple/30 to-brand-dark/50 text-brand-light shadow-glow">
                <Icon name={service.icon} className="h-8 w-8" />
              </div>
              <div>
                <p className="font-mono text-xs tracking-[0.35em] text-brand-light uppercase">
                  {page.tag[lang]}
                </p>
                <h1 className="mt-3 font-display text-[clamp(1.6rem,7vw,2.25rem)] leading-[1.1] font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  <span className="text-gradient">{service.title[lang]}</span>
                </h1>
              </div>
            </div>

            <p className="mt-8 max-w-3xl font-serif text-xl leading-relaxed text-mist/80 sm:text-2xl">
              {page.headline[lang]}
            </p>

            <div className="mt-8 space-y-5">
              {page.overview.map((para, i) => (
                <p
                  key={i}
                  className="max-w-3xl text-base leading-relaxed font-light text-mist/60"
                >
                  {para[lang]}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative py-14">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.35em] text-brand-purple/80 uppercase">
              {page.featuresLabel[lang]}
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.features.map((feature, i) => (
              <Reveal key={feature.title.en} delay={(i % 3) * 100}>
                <div className="card-border group h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-lg">
                  <span className="font-mono text-[11px] text-brand-purple/80">
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-base font-bold tracking-wide text-white">
                    {feature.title[lang]}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed font-light text-mist/60">
                    {feature.desc[lang]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="font-mono text-xs tracking-[0.35em] text-brand-purple/80 uppercase">
                {page.deliverablesLabel[lang]}
              </p>
              <ul className="mt-8 space-y-4">
                {page.deliverables.map((item) => (
                  <li key={item.en} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-purple/20 text-brand-light">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    <span className="text-sm leading-relaxed font-light text-mist/75">
                      {item[lang]}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <p className="font-mono text-xs tracking-[0.35em] text-brand-purple/80 uppercase">
                {page.faqsLabel[lang]}
              </p>
              <div className="mt-8 space-y-3">
                {page.faqs.map((faq, i) => {
                  const open = openFaq === i;
                  return (
                    <div
                      key={faq.q.en}
                      className={`card-border overflow-hidden rounded-xl transition-all duration-300 ${
                        open ? "shadow-glow" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? -1 : i)}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left"
                        aria-expanded={open}
                      >
                        <span className="font-display text-sm font-bold tracking-wide text-white">
                          {faq.q[lang]}
                        </span>
                        <span
                          className={`shrink-0 font-mono text-lg text-brand-light transition-transform duration-300 ${
                            open ? "rotate-45" : ""
                          }`}
                        >
                          +
                        </span>
                      </button>
                      <div
                        className={`grid transition-all duration-500 ease-in-out ${
                          open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-sm leading-relaxed font-light text-mist/60">
                            {faq.a[lang]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-14">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <p className="font-mono text-xs tracking-[0.35em] text-brand-light uppercase">
                {t.servicePage.relatedLabel[lang]}
              </p>
              <Link
                href="/#services"
                className="font-mono text-[10px] tracking-[0.2em] text-mist/55 uppercase transition-colors hover:text-brand-light"
              >
                {t.servicePage.exploreAll[lang]} →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item.slug} delay={i * 100}>
                <Link
                  href={`/services/${item.slug}`}
                  className="card-border group block h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-glow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/25 to-brand-dark/40 text-brand-light transition-all duration-500 group-hover:from-brand-purple group-hover:text-white group-hover:shadow-glow">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-bold tracking-wide text-white">
                    {item.title[lang]}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed font-light text-mist/60">
                    {item.desc[lang]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-brand-light transition-all duration-300 group-hover:gap-3">
                    {t.services.viewMore[lang]} →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="card-border relative overflow-hidden rounded-3xl p-6 text-center sm:p-14">
              <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-[520px] -translate-x-1/2 rounded-full bg-brand-purple/20 blur-3xl" />
              <h2 className="relative font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                {t.servicePage.ctaTitle[lang]}{" "}
                <span className="text-gradient">{service.title[lang]}</span>
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-base font-light text-mist/60">
                {t.servicePage.ctaSubtitle[lang]}
              </p>
              <Link
                href={`/?service=${service.slug}#contact`}
                className="relative mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-brand-dark via-brand-purple to-brand-light px-6 py-3.5 font-display text-xs font-bold tracking-widest text-white uppercase shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow-lg sm:w-auto sm:px-8 sm:py-4 sm:text-sm"
              >
                {t.servicePage.ctaButton[lang]}
                <span aria-hidden>→</span>
              </Link>
              <div className="relative mt-8 border-t border-white/10 pt-5">
                <p className="font-mono text-[10px] tracking-[0.24em] text-mist/45 uppercase">
                  {t.servicePage.nextSteps[lang]}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
                  <Link
                    href="/#services"
                    className="text-xs text-mist/65 transition-colors hover:text-brand-light"
                  >
                    {t.nav.allServices[lang]} →
                  </Link>
                  <Link
                    href="/#team"
                    className="text-xs text-mist/65 transition-colors hover:text-brand-light"
                  >
                    {t.nav.team[lang]} →
                  </Link>
                  <Link
                    href="/#process"
                    className="text-xs text-mist/65 transition-colors hover:text-brand-light"
                  >
                    {t.nav.process[lang]} →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
