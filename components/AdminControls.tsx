"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AutoRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:border-rose-400/40 hover:text-rose-200 disabled:opacity-50"
    >
      {busy ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}

export function DeleteLeadButton({ id, label }: { id: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (
      !window.confirm(
        `¿Borrar el registro de ${label}? Se eliminará el lead y los eventos de correo asociados. Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        window.alert("No se pudo borrar el registro. Inténtalo de nuevo.");
      }
    } catch {
      window.alert("Error de red. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={() => void remove()}
      disabled={busy}
      title="Borrar registro y eventos asociados"
      className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-white/50 transition hover:border-rose-400/40 hover:text-rose-200 disabled:opacity-50"
    >
      {busy ? "Borrando…" : "Borrar"}
    </button>
  );
}
