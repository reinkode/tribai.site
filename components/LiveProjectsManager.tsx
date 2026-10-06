"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export type LiveProjectRow = {
  name: string;
  url: string;
  updatedAt: string;
};

const inputClass =
  "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-mist outline-none transition placeholder:text-white/30 focus:border-brand-purple/60";
const buttonClass =
  "rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:border-brand-purple/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

export default function LiveProjectsManager({ projects }: { projects: LiveProjectRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [probe, setProbe] = useState<{
    key: string;
    running: boolean;
    ok: boolean;
    text: string;
  } | null>(null);

  async function testConnection(key: string, target: string): Promise<void> {
    setProbe({ key, running: true, ok: false, text: "Probando…" });
    try {
      const res = await fetch("/api/admin/live/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        status?: number;
        contentType?: string | null;
        bytes?: number;
        error?: string;
        hint?: string;
      };
      if (data.ok) {
        const type = (data.contentType ?? "").split(";")[0] || "tipo desconocido";
        setProbe({
          key,
          running: false,
          ok: true,
          text: `OK · HTTP ${data.status} · ${type} · ${data.bytes ?? 0} B recibidos`,
        });
      } else if (data.error === "invalid_url") {
        setProbe({ key, running: false, ok: false, text: data.hint ?? "URL inválida." });
      } else {
        const reason =
          data.error === "timeout" ? "tiempo agotado (10 s)" : "destino no alcanzable";
        setProbe({ key, running: false, ok: false, text: `Fallo: ${reason}` });
      }
    } catch {
      setProbe({ key, running: false, ok: false, text: "Fallo: error de red hacia la API." });
    }
  }

  async function save(projectName: string, projectUrl: string): Promise<boolean> {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName, url: projectUrl }),
      });
      const data = (await res.json().catch(() => ({}))) as { hint?: string };
      if (!res.ok) {
        setError(data.hint ?? "No se pudo guardar. Inténtalo de nuevo.");
        return false;
      }
      return true;
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function create(event: FormEvent) {
    event.preventDefault();
    const savedUrl = url;
    if (await save(name, savedUrl)) {
      setName("");
      setUrl("");
      router.refresh();
      void testConnection("form", savedUrl);
    }
  }

  async function saveEdit(project: LiveProjectRow) {
    if (await save(project.name, editUrl)) {
      setEditing(null);
      router.refresh();
    }
  }

  async function remove(project: LiveProjectRow) {
    if (!window.confirm(`¿Eliminar la conexión "${project.name}"?`)) return;
    setError(null);
    const res = await fetch(`/api/admin/live?name=${encodeURIComponent(project.name)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError("No se pudo eliminar. Inténtalo de nuevo.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      {error ? (
        <p className="mb-4 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-200">
          {error}
        </p>
      ) : null}

      <form onSubmit={create} className="flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="nombre-del-proyecto"
          pattern="[A-Za-z0-9\-]+"
          title="Letras, números y guiones (máx. 40)"
          maxLength={40}
          required
          className={`w-48 font-mono text-xs ${inputClass}`}
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://xxxx.ngrok.io"
          type="text"
          inputMode="url"
          required
          className={`w-72 font-mono text-xs ${inputClass}`}
        />
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Guardando…" : "Añadir / actualizar"}
        </button>
        <button
          type="button"
          disabled={!url.trim() || probe?.running}
          onClick={() => void testConnection("form", url)}
          className={buttonClass}
        >
          {probe?.key === "form" && probe.running ? "Probando…" : "Probar"}
        </button>
      </form>
      {probe?.key === "form" && !probe.running ? (
        <p
          className={`mt-2 text-xs ${probe.ok ? "text-emerald-300/90" : "text-rose-300/90"}`}
          role="status"
        >
          {probe.text}
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Destino del túnel</th>
              <th className="px-4 py-3 font-medium">Actualizado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-white/40">
                  Aún no hay conexiones. Añade la URL de tu túnel arriba.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.name} className="align-top transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/live/${project.name}`}
                      target="_blank"
                      className="font-mono text-xs text-brand-light hover:underline"
                    >
                      /live/{project.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {editing === project.name ? (
                      <input
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className={`w-64 font-mono text-xs ${inputClass}`}
                        autoFocus
                      />
                    ) : (
                      <span className="block max-w-[20rem] truncate font-mono text-xs text-white/60" title={project.url}>
                        {project.url}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-white/45">{project.updatedAt}</td>
                  <td className="px-4 py-3">
                    {editing === project.name ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void saveEdit(project)}
                          className={buttonClass}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className={buttonClass}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(project.name);
                              setEditUrl(project.url);
                              setError(null);
                            }}
                            className={buttonClass}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={probe?.running}
                            onClick={() => void testConnection(`row:${project.name}`, project.url)}
                            className={buttonClass}
                          >
                            {probe?.key === `row:${project.name}` && probe.running
                              ? "Probando…"
                              : "Probar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void remove(project)}
                            className="rounded-lg border border-rose-400/25 px-3 py-2 text-xs text-rose-300/90 transition hover:border-rose-400/60 hover:text-rose-200"
                          >
                            Eliminar
                          </button>
                        </div>
                        {probe?.key === `row:${project.name}` && !probe.running ? (
                          <p
                            className={`mt-2 text-[11px] ${probe.ok ? "text-emerald-300/90" : "text-rose-300/90"}`}
                            role="status"
                          >
                            {probe.text}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 max-w-2xl text-[11px] leading-5 text-white/35">
        El proxy reescribe automáticamente las rutas absolutas del proyecto (estilos,
        scripts, enlaces y referencias a su propio dominio) para que todo cargue bajo{" "}
        <span className="font-mono">/live/&lt;nombre&gt;</span>. No atraviesa WebSocket: el
        recarga-en-caliente (HMR) del modo desarrollo no funcionará, pero la página sí.
      </p>
    </div>
  );
}
