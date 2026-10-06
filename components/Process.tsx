"use client";

import Reveal from "./Reveal";
import { useLanguage } from "@/lib/language";

export default function Process() {
  const { lang, t } = useLanguage();

  return (
    <section id="process" className="bg-grid relative py-24 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.35em] text-brand-light uppercase">
            {t.process.tag[lang]}
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
            {t.process.title[lang]}{" "}
            <span className="text-gradient">{t.process.titleAccent[lang]}</span>
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute top-8 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent lg:block" />
          {t.process.steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 140}>
              <div className="group relative">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-purple/40 bg-abyss font-display text-lg font-black text-brand-light shadow-glow transition-all duration-500 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-brand-purple group-hover:to-brand-dark group-hover:text-white">
                  {step.num}
                </div>
                <h3 className="mt-6 font-display text-xl font-bold tracking-wide text-white">
                  {step.title[lang]}
                </h3>
                <p className="mt-3 text-sm leading-relaxed font-light text-mist/60">
                  {step.desc[lang]}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
