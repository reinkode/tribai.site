"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Contraseña incorrecta.",
  too_many_requests: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
  not_configured: "El panel no está configurado (falta ADMIN_PASSWORD).",
  invalid_body: "Solicitud inválida.",
};

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (response.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      setError(ERROR_MESSAGES[data.error ?? ""] ?? "No se pudo iniciar sesión.");
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-white/50">Contraseña</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-mist outline-none transition focus:border-brand-purple/60 focus:ring-2 focus:ring-brand-purple/30"
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy || password.length === 0}
        className="btn-primary w-full rounded-lg bg-brand-purple px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-brand-purple/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Verificando…" : "Entrar"}
      </button>
    </form>
  );
}
