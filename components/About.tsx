"use client";

import Link from "next/link";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/language";

export default function About() {
  const { lang, t } = useLanguage();

  return (
    <section id="about" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="orb absolute top-20 -right-32 h-96 w-96 rounded-full bg-brand-dark/25 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="font-mono text-xs tracking-[0.35em] text-brand-light uppercase">
                {t.about.tag[lang]}
              </p>
              <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
                {t.about.title[lang]}{" "}
                <span className="text-gradient">{t.about.titleAccent[lang]}</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed font-light text-mist/65">
                {t.about.body[lang]}
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-10 flex flex-wrap gap-2.5">
                {t.about.traits[lang].map((trait) => (
                  <span
                    key={trait}
                    className="glass rounded-full px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] text-mist/70"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="relative mt-12 hidden justify-center lg:flex">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-64 w-64 animate-spin-slow rounded-full border border-dashed border-brand-purple/25" />
                </div>
                <img
                  src="/logo.png"
                  alt="TribAI symbol"
                  className="relative h-56 w-56 object-contain drop-shadow-[0_0_40px_rgba(160,32,240,0.35)]"
                />
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            <Reveal delay={100}>
              <div className="card-border rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-brand-purple shadow-glow" />
                  <h3 className="font-display text-sm font-bold tracking-[0.3em] text-brand-light">
                    {t.about.mission.label[lang]}
                  </h3>
                </div>
                <p className="mt-4 font-serif text-lg leading-relaxed text-mist/80 italic">
                  {t.about.mission.text[lang]}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="card-border rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-brand-light shadow-glow" />
                  <h3 className="font-display text-sm font-bold tracking-[0.3em] text-brand-light">
                    {t.about.vision.label[lang]}
                  </h3>
                </div>
                <p className="mt-4 font-serif text-lg leading-relaxed text-mist/80 italic">
                  {t.about.vision.text[lang]}
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="card-border rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-brand-dark shadow-glow" />
                  <h3 className="font-display text-sm font-bold tracking-[0.3em] text-brand-light">
                    {t.about.values.label[lang]}
                  </h3>
                </div>
                <div className="mt-5 flex flex-col gap-5">
                  {t.about.values.items.map((value) => (
                    <div key={value.name.en} className="border-l-2 border-brand-purple/40 pl-4">
                      <h4 className="font-display text-sm font-bold tracking-wider text-white">
                        {value.name[lang]}
                      </h4>
                      <p className="mt-1 text-sm font-light text-mist/60">
                        {value.desc[lang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div id="team" className="mt-24 border-t border-white/10 pt-20 lg:mt-32 lg:pt-24">
          <Reveal>
            <div className="max-w-3xl">
              <p className="font-mono text-xs tracking-[0.35em] text-brand-light uppercase">
                {t.about.team.tag[lang]}
              </p>
              <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
                {t.about.team.title[lang]}{" "}
                <span className="text-gradient">{t.about.team.titleAccent[lang]}</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed font-light text-mist/65">
                {t.about.team.body[lang]}
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {t.about.team.disciplines.map((discipline, i) => (
              <Reveal key={discipline.code} delay={(i % 2) * 120}>
                <article className="enterprise-panel h-full rounded-2xl p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.25em] text-brand-light">
                      /{discipline.code}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/15 text-brand-light">
                      <Icon name={discipline.icon} className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-7 font-display text-xl font-bold tracking-tight text-white">
                    {discipline.title[lang]}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed font-light text-mist/60">
                    {discipline.desc[lang]}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                    {discipline.serviceSlugs.map((slug) => {
                      const service = t.services.items.find((item) => item.slug === slug);
                      if (!service) return null;
                      return (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-mist/70 transition-colors hover:border-brand-purple/50 hover:text-brand-light"
                        >
                          {service.title[lang]} →
                        </Link>
                      );
                    })}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
