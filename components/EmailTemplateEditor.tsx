"use client";

import { useMemo, useState } from "react";
import type { EmailTemplate } from "@/lib/templates";

type Lang = "en" | "es";

type TemplateInfo = {
  templates: Record<Lang, EmailTemplate>;
  source: "database" | "defaults";
  updatedAt: string | null;
};

const PLACEHOLDERS = [
  "{{name}}",
  "{{email}}",
  "{{service}}",
  "{{message}}",
  "{{confirm_url}}",
  "{{confirm_button}}",
];

// Mirrors buildConfirmButton() in lib/templates.ts so the preview shows the
// same block recipients get. confirm_button is HTML, so fill() must not
// escape it — same as the trusted list in the real renderTemplate() call.
function sampleConfirmButton(lang: Lang): string {
  const label = lang === "es" ? "Confirmar mi correo" : "Confirm my email address";
  return `<div style="margin:0 0 16px;text-align:center"><a href="${SAMPLE_CONFIRM_URL}" style="display:inline-block;padding:12px 30px;background:#A020F0;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;border-radius:8px">${label}</a></div>`;
}

const SAMPLE_CONFIRM_URL =
  "https://tribai.site/api/confirm/0123456789abcdef0123456789abcdef0123456789abcdef";

const SAMPLE: Record<Lang, Record<string, string>> = {
  en: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    service: "AI Implementation",
    message: "Hi! I would like to know more about your automation services for my business.",
    confirm_url: SAMPLE_CONFIRM_URL,
    confirm_button: sampleConfirmButton("en"),
  },
  es: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    service: "Implementación de IA",
    message: "¡Hola! Me gustaría saber más sobre sus servicios de automatización para mi negocio.",
    confirm_url: SAMPLE_CONFIRM_URL,
    confirm_button: sampleConfirmButton("es"),
  },
};

const TRUSTED_SAMPLE_KEYS = new Set(["confirm_button"]);

const inputClass =
  "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-mist outline-none transition placeholder:text-white/30 focus:border-brand-purple/60";
const buttonClass =
  "rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:border-brand-purple/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

// Mirrors renderTemplate() in lib/templates.ts so the preview matches what
// recipients get (placeholders filled with HTML-escaped sample values, except
// trusted keys like confirm_button whose HTML is generated server-side).
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fill(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) =>
    name in variables
      ? TRUSTED_SAMPLE_KEYS.has(name)
        ? variables[name]
        : escapeHtml(variables[name])
      : match,
  );
}

export function EmailTemplateEditor({ initial }: { initial: TemplateInfo }) {
  const [draft, setDraft] = useState<Record<Lang, EmailTemplate>>(initial.templates);
  const [saved, setSaved] = useState<Record<Lang, EmailTemplate>>(initial.templates);
  const [lang, setLang] = useState<Lang>("es");
  const [source, setSource] = useState(initial.source);
  const [updatedAt, setUpdatedAt] = useState(initial.updatedAt);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const dirty =
    draft.en.subject !== saved.en.subject ||
    draft.en.html !== saved.en.html ||
    draft.es.subject !== saved.es.subject ||
    draft.es.html !== saved.es.html;

  const preview = useMemo(() => {
    const filled = fill(draft[lang].html, SAMPLE[lang]);
    return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8" /></head><body style="margin:0">${filled}</body></html>`;
  }, [draft, lang]);

  function update(field: keyof EmailTemplate, value: string) {
    setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
    setNotice(null);
  }

  async function refresh() {
    const res = await fetch("/api/admin/email-template", { cache: "no-store" });
    const data = (await res.json().catch(() => ({}))) as Partial<TemplateInfo> & {
      ok?: boolean;
    };
    if (res.ok && data.templates) {
      setDraft(data.templates);
      setSaved(data.templates);
      setSource(data.source ?? "defaults");
      setUpdatedAt(data.updatedAt ?? null);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/email-template", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ en: draft.en, es: draft.es }),
      });
      const data = (await res.json().catch(() => ({}))) as { hint?: string };
      if (!res.ok) {
        setError(data.hint ?? "No se pudo guardar. Inténtalo de nuevo.");
        return;
      }
      await refresh();
      setNotice("Plantilla guardada. Los próximos registros la recibirán.");
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!window.confirm("¿Restablecer la plantilla a la versión predeterminada? Se perderán tus cambios.")) {
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/email-template", { method: "DELETE" });
      if (!res.ok) {
        setError("No se pudo restablecer. Inténtalo de nuevo.");
        return;
      }
      await refresh();
      setNotice("Plantilla restablecida a la versión predeterminada.");
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  const current = draft[lang];

  return (
    <div>
      {error ? (
        <p className="mb-4 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-200">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
          {notice}
        </p>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-white/10 p-0.5">
          {(["es", "en"] as Lang[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setLang(value)}
              className={`rounded-md px-4 py-1.5 text-xs uppercase tracking-wide transition ${
                lang === value
                  ? "bg-brand-purple/25 text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[11px] ${
            source === "database"
              ? "border-brand-purple/40 bg-brand-purple/10 text-brand-light"
              : "border-white/10 text-white/45"
          }`}
        >
          {source === "database" ? "Personalizada" : "Predeterminada"}
        </span>
        {updatedAt ? (
          <span className="text-[11px] text-white/35">
            Última modificación:{" "}
            {new Date(updatedAt).toLocaleString("es", { dateStyle: "short", timeStyle: "short" })}
          </span>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/45">
            Asunto ({lang.toUpperCase()})
          </label>
          <input
            value={current.subject}
            onChange={(e) => update("subject", e.target.value)}
            maxLength={300}
            className={`w-full font-mono text-xs ${inputClass}`}
          />
          <p className="mt-1 text-right text-[10px] text-white/30">{current.subject.length}/300</p>

          <label className="mb-1 mt-2 block text-[11px] uppercase tracking-wider text-white/45">
            HTML del correo
          </label>
          <textarea
            value={current.html}
            onChange={(e) => update("html", e.target.value)}
            rows={16}
            spellCheck={false}
            className={`w-full resize-y font-mono text-xs leading-5 ${inputClass}`}
          />
          <p className="mt-1 text-right text-[10px] text-white/30">
            {current.html.length.toLocaleString("es")} / 200.000
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" disabled={saving || !dirty} onClick={() => void save()} className={buttonClass}>
              {saving ? "Guardando…" : "Guardar ambos idiomas"}
            </button>
            <button
              type="button"
              disabled={saving || source === "defaults"}
              onClick={() => void reset()}
              className={buttonClass}
            >
              Restablecer predeterminada
            </button>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-white/35">
            Variables disponibles (se reemplazan con los datos del registro, escapados):{" "}
            {PLACEHOLDERS.map((placeholder) => (
              <code key={placeholder} className="mr-1 font-mono text-brand-light/80">
                {placeholder}
              </code>
            ))}
            Se envía la versión del idioma en que el usuario envió el formulario.
          </p>
        </div>

        <div>
          <p className="mb-1 text-[11px] uppercase tracking-wider text-white/45">
            Vista previa (datos de ejemplo)
          </p>
          <iframe
            sandbox=""
            title="Vista previa del correo"
            srcDoc={preview}
            className="h-[560px] w-full rounded-xl border border-white/10 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
