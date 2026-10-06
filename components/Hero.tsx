"use client";

import HeroChat from "./HeroChat";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/language";

export default function Hero() {
  const { lang, t } = useLanguage();

  return (
        <section id="top" className="bg-grid relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
          {/* ambient glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="orb absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-radial-fade blur-2xl" />
            <div className="orb-2 absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-brand-dark/30 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-purple/10 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <Reveal>
                <div className="glass mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-purple opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-light" />
                  </span>
                  <span className="font-mono text-[11px] font-medium tracking-[0.25em] text-brand-light uppercase">
                    {t.hero.badge[lang]}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <h1 className="font-display text-[clamp(1.9rem,8.5vw,3.75rem)] leading-[1.05] font-black tracking-tight text-white lg:text-[clamp(2.25rem,3.4vw,4.5rem)] lg:leading-[1.02]">
                  {t.hero.titleA[lang]}
                  <br />
                  <span className="text-gradient">{t.hero.titleB[lang]}</span>
                </h1>
              </Reveal>

              <Reveal delay={240}>
                <p className="mt-7 max-w-xl text-lg leading-relaxed font-light text-mist/70">
                  {t.hero.subtitle[lang]}
                </p>
              </Reveal>

              <Reveal delay={360}>
                <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                  <a
                    href="#contact"
                    className="btn-primary w-full rounded-full bg-gradient-to-r from-brand-dark via-brand-purple to-brand-dark bg-[length:200%_auto] px-5 py-3.5 text-center font-display text-xs font-bold tracking-widest text-white uppercase shadow-glow transition-all hover:bg-right hover:shadow-glow-lg sm:w-auto sm:px-8 sm:py-4 sm:text-sm"
                  >
                    {t.hero.ctaPrimary[lang]}
                  </a>
                  <a
                    href="#services"
                    className="glass w-full rounded-full px-5 py-3.5 text-center font-display text-xs font-bold tracking-widest text-mist uppercase transition-all hover:border-brand-purple/50 hover:text-brand-light sm:w-auto sm:px-8 sm:py-4 sm:text-sm"
                  >
                    {t.hero.ctaSecondary[lang]}
                  </a>
                </div>
              </Reveal>

              <Reveal delay={480}>
                <div className="mt-12">
                  <div className="flex flex-wrap gap-2">
                    {t.hero.signals[lang].map((signal) => (
                      <span
                        key={signal}
                        className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-mist/55"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 font-serif text-base text-mist/50 italic">
                    “Trí” — three triangles, one intelligence.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={300} className="relative">
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-brand-purple/15 blur-3xl" />
              <div className="relative animate-float">
                <HeroChat />
              </div>
            </Reveal>
          </div>

          <div className="relative mt-16 flex justify-center">
            <a
              href="#services"
              className="flex flex-col items-center gap-2 text-mist/40 transition-colors hover:text-brand-light"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase">
                {t.hero.scroll[lang]}
              </span>
              <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-brand-purple to-transparent" />
            </a>
          </div>
        </section>
  );
}
