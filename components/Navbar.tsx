"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/language";

export default function Navbar() {
  const { lang, t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  useEffect(() => {
    setServicesOpen(false);
  }, [pathname]);

  const anchor = (id: string) => (isHome ? `#${id}` : `/#${id}`);
  const links = [
    { href: anchor("about"), label: t.nav.about[lang] },
    { href: anchor("team"), label: t.nav.team[lang] },
    { href: anchor("process"), label: t.nav.process[lang] },
    { href: anchor("contact"), label: t.nav.contact[lang] },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-void/85 py-3 backdrop-blur-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href={isHome ? "#top" : "/"} className="group flex items-center gap-3">
          <img
            src="/logo.png"
            alt="TribAI logo"
            className="h-10 w-10 transition-transform duration-500 group-hover:rotate-[30deg]"
          />
          <span className="font-display text-lg font-bold tracking-[0.3em] text-white">
            TRIB<span className="text-gradient">AI</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          <div ref={servicesRef} className="relative">
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              className={`flex items-center gap-2 font-sans text-sm font-medium tracking-wide transition-colors hover:text-brand-light ${
                servicesOpen ? "text-brand-light" : "text-mist/70"
              }`}
            >
              {t.nav.services[lang]}
              <span
                className={`font-mono text-xs transition-transform duration-300 ${
                  servicesOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ↓
              </span>
            </button>
            {servicesOpen && (
              <div className="msg-in absolute left-0 top-9 max-h-[calc(100dvh-7rem)] w-[min(680px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-white/10 bg-abyss/95 p-5 shadow-card backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <p className="font-mono text-[10px] tracking-[0.24em] text-brand-light uppercase">
                    {t.nav.allServices[lang]}
                  </p>
                  <a
                    href={anchor("services")}
                    onClick={() => setServicesOpen(false)}
                    className="font-mono text-[10px] tracking-[0.18em] text-mist/50 uppercase transition-colors hover:text-brand-light"
                  >
                    06 →
                  </a>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-2">
                  {t.services.items.map((service) => (
                    <a
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      onClick={() => setServicesOpen(false)}
                      className="group/service flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-purple/15 text-brand-light transition-colors group-hover/service:bg-brand-purple group-hover/service:text-white">
                        <Icon name={service.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-xs font-bold tracking-wide text-white">
                          {service.title[lang]}
                        </span>
                        <span className="mt-1 block truncate text-[11px] text-mist/45">
                          {service.desc[lang]}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setServicesOpen(false)}
              className="font-sans text-sm font-medium tracking-wide text-mist/70 transition-colors hover:text-brand-light"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <a
            href={anchor("contact")}
            className="btn-primary rounded-full bg-gradient-to-r from-brand-dark via-brand-purple to-brand-dark bg-[length:200%_auto] px-6 py-2.5 text-xs font-bold tracking-widest text-white shadow-glow transition-all hover:bg-right hover:shadow-glow-lg"
          >
            {t.nav.cta[lang].toUpperCase()}
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
          className="glass flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
        >
          <span className={`h-0.5 w-4 bg-mist transition-all ${open ? "translate-y-1 rotate-45" : ""}`} />
          <span className={`h-0.5 w-4 bg-mist transition-all ${open ? "-translate-y-1 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/5 bg-void/95 px-6 py-6 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl">
            <a
              href={anchor("services")}
              onClick={() => setOpen(false)}
              className="font-mono text-[11px] tracking-[0.25em] text-brand-light uppercase"
            >
              {t.nav.services[lang]}
            </a>
            <div className="mt-3 grid gap-1 border-l border-brand-purple/30 pl-4">
              {t.services.items.map((service) => (
                <a
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg py-2 text-sm text-mist/75 transition-colors hover:text-brand-light"
                >
                  <Icon name={service.icon} className="h-4 w-4 text-brand-light" />
                  {service.title[lang]}
                </a>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-5 border-t border-white/5 pt-5">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-mist/80 hover:text-brand-light"
                >
                  {link.label}
                </a>
              ))}
              <div className="md:hidden">
                <LanguageSwitcher align="left" direction="up" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
