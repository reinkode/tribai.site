"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language";

export default function Footer() {
  const { lang, t } = useLanguage();
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const anchor = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);

  const companyLinks = [
    { href: anchor("service-overview"), label: t.footer.serviceOverview[lang] },
    { href: anchor("about"), label: t.nav.about[lang] },
    { href: anchor("team"), label: t.nav.team[lang] },
    { href: anchor("process"), label: t.nav.process[lang] },
    { href: anchor("contact"), label: t.nav.contact[lang] },
  ];

  return (
    <footer className="border-t border-white/5 bg-abyss/60">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="TribAI" className="h-11 w-11" />
              <div>
                <p className="font-display text-base font-bold tracking-[0.3em] text-white">
                  TRIB<span className="text-gradient">AI</span>{" "}
                  <span className="ml-1 text-[10px] font-medium tracking-[0.2em] text-mist/40">
                    LLC
                  </span>
                </p>
                <p className="mt-1 font-serif text-xs text-mist/50 italic">
                  {t.footer.tagline[lang]}
                </p>
              </div>
            </div>
            <a
              href={anchor("contact")}
              className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-brand-light uppercase transition-colors hover:text-white"
            >
              {t.nav.cta[lang]} <span aria-hidden>→</span>
            </a>
          </div>

          <nav aria-label={t.footer.servicesLabel[lang]}>
            <p className="font-mono text-[10px] tracking-[0.28em] text-brand-light uppercase">
              {t.footer.servicesLabel[lang]}
            </p>
            <div className="mt-5 grid gap-3">
              <a
                href={anchor("services")}
                className="text-sm font-medium text-white transition-colors hover:text-brand-light"
              >
                {t.nav.allServices[lang]}
              </a>
              {t.services.items.map((service) => (
                <a
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="text-sm text-mist/60 transition-colors hover:text-brand-light"
                >
                  {service.title[lang]}
                </a>
              ))}
            </div>
          </nav>

          <nav aria-label={t.footer.companyLabel[lang]}>
            <p className="font-mono text-[10px] tracking-[0.28em] text-brand-light uppercase">
              {t.footer.companyLabel[lang]}
            </p>
            <div className="mt-5 grid gap-3">
              {companyLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-mist/60 transition-colors hover:text-brand-light"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-center text-xs text-mist/40">
            © {year} TribAI LLC. {t.footer.rights[lang]}
          </p>
          <p className="text-center font-mono text-[10px] tracking-[0.3em] text-brand-purple/70 uppercase">
            {t.footer.madeWith[lang]} · tribai.site
          </p>
        </div>
      </div>
    </footer>
  );
}
