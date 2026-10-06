import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");
  const configured = isAdminConfigured();

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="card-border w-full max-w-sm rounded-2xl p-8">
        <p className="font-display text-2xl">
          <span className="text-gradient">TribAI</span>
        </p>
        <h1 className="mt-1 font-display text-[11px] uppercase tracking-[0.35em] text-white/50">
          Panel de administración
        </h1>

        {configured ? (
          <AdminLoginForm />
        ) : (
          <p className="mt-6 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200/90">
            El panel no está configurado. Define{" "}
            <code className="font-mono text-xs">ADMIN_PASSWORD</code> en las variables de
            entorno y reinicia el servidor.
          </p>
        )}
      </div>
    </main>
  );
}
