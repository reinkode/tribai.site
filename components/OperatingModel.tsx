"use client";

import Reveal from "./Reveal";
import { useLanguage } from "@/lib/language";

export default function OperatingModel() {
  const { lang, t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="font-mono text-xs tracking-[0.35em] text-brand-light uppercase">
                {t.operatingModel.tag[lang]}
              </p>
              <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
                {t.operatingModel.title[lang]}{" "}
                <span className="text-gradient">{t.operatingModel.titleAccent[lang]}</span>
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed font-light text-mist/60 lg:pb-1">
              {t.operatingModel.subtitle[lang]}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {t.operatingModel.stages.map((stage, i) => (
            <Reveal key={stage.code} delay={i * 110}>
              <article className="enterprise-panel relative h-full overflow-hidden rounded-2xl p-7">
                <span className="absolute right-5 top-3 font-display text-7xl font-black text-white/[0.035]">
                  {stage.code}
                </span>
                <p className="relative font-mono text-xs tracking-[0.28em] text-brand-light">
                  /{stage.code}
                </p>
                <h3 className="relative mt-8 max-w-xs font-display text-xl font-bold tracking-tight text-white">
                  {stage.title[lang]}
                </h3>
                <p className="relative mt-4 max-w-sm text-sm leading-relaxed font-light text-mist/60">
                  {stage.desc[lang]}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
