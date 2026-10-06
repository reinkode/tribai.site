import Link from "next/link";
import { redirect } from "next/navigation";
import { AutoRefresh, DeleteLeadButton, LogoutButton } from "@/components/AdminControls";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { listLiveProjects } from "@/lib/live";
import type { Inquiry } from "@/lib/mailer";
import { getDefaultTemplate, getTemplatePair } from "@/lib/templates";
import LiveProjectsManager from "@/components/LiveProjectsManager";
import { EmailTemplateEditor } from "@/components/EmailTemplateEditor";

export const dynamic = "force-dynamic";

type LeadStatus = "pending" | "sent" | "delivered" | "failed";

const STATUSES: LeadStatus[] = ["pending", "sent", "delivered", "failed"];
const STATUS_LABEL: Record<LeadStatus, string> = {
  pending: "Pendiente",
  sent: "Enviado",
  delivered: "Entregado",
  failed: "Fallido",
};
const STATUS_STYLE: Record<LeadStatus, string> = {
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  sent: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  delivered: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  failed: "border-rose-400/30 bg-rose-400/10 text-rose-300",
};
const PAGE_SIZE = 25;

type LeadRow = {
  id: string;
  payload: Inquiry;
  status: LeadStatus;
  attempts: number;
  last_error: string | null;
  resend_email_id: string | null;
  confirmed_at: Date | null;
  created_at: Date;
  sent_at: Date | null;
  delivered_at: Date | null;
};

type EventRow = {
  svix_id: string;
  type: string;
  email_id: string | null;
  received_at: Date;
};

type SearchParams = { q?: string; status?: string; page?: string; tab?: string };

const dateFormat = new Intl.DateTimeFormat("es", { dateStyle: "short", timeStyle: "short" });

function formatDate(value: Date | null): string {
  return value ? dateFormat.format(value) : "—";
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const params = await searchParams;
  const tab =
    params.tab === "eventos"
      ? "eventos"
      : params.tab === "tuneles"
        ? "tuneles"
        : params.tab === "correo"
          ? "correo"
          : "leads";
  const q = (params.q ?? "").trim().slice(0, 120);
  const status = STATUSES.includes(params.status as LeadStatus)
    ? (params.status as LeadStatus)
    : null;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const leadsHref = (overrides: { q?: string; status?: string; page?: string }) => {
    const merged: Record<string, string | undefined> = {
      q: q || undefined,
      status: status || undefined,
      ...overrides,
    };
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) search.set(key, value);
    }
    const qs = search.toString();
    return qs ? `/admin?${qs}` : "/admin";
  };

  const sql = getSql();
  const stats: Record<LeadStatus, number> = { pending: 0, sent: 0, delivered: 0, failed: 0 };
  let leads: LeadRow[] = [];
  let events: EventRow[] = [];
  let liveProjects: Awaited<ReturnType<typeof listLiveProjects>> = [];
  let emailTemplateInfo: Awaited<ReturnType<typeof getTemplatePair>> | null = null;
  let total = 0;
  let confirmedCount = 0;
  let dbError = false;

  if (sql) {
    try {
      const filters = [];
      if (status) filters.push(sql`status = ${status}`);
      if (q) {
        filters.push(
          sql`(payload->>'name' ilike ${"%" + q + "%"} or payload->>'email' ilike ${"%" + q + "%"})`,
        );
      }
      const where = filters.length
        ? sql`where ${filters.reduce((acc, filter) => sql`${acc} and ${filter}`)}`
        : sql``;

      const statsRows = await sql<{ status: LeadStatus; count: number }[]>`
        select status, count(*)::int as count from outbox group by status
      `;
      for (const row of statsRows) stats[row.status] = row.count;
      const confirmedRows = await sql<{ count: number }[]>`
        select count(*)::int as count from outbox where confirmed_at is not null
      `;
      confirmedCount = confirmedRows[0]?.count ?? 0;

      if (tab === "leads") {
        const [leadRows, countRows] = await Promise.all([
          sql<LeadRow[]>`
            select id, payload, status, attempts, last_error, resend_email_id,
                   confirmed_at, created_at, sent_at, delivered_at
            from outbox
            ${where}
            order by created_at desc
            limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}
          `,
          sql<{ count: number }[]>`select count(*)::int as count from outbox ${where}`,
        ]);
        leads = leadRows;
        total = countRows[0]?.count ?? 0;
      } else if (tab === "tuneles") {
        liveProjects = await listLiveProjects();
      } else if (tab === "correo") {
        emailTemplateInfo = await getTemplatePair("confirmation");
      } else {
        events = await sql<EventRow[]>`
          select svix_id, type, email_id, received_at
          from webhook_events
          order by received_at desc
          limit 100
        `;
      }
    } catch (error) {
      console.error("admin: database query failed", error);
      dbError = true;
    }
  }

  const totalLeads = stats.pending + stats.sent + stats.delivered + stats.failed;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-xl">
            <span className="text-gradient">TribAI</span>
            <span className="ml-2 text-sm text-white/40">· Administración</span>
          </p>
          <h1 className="mt-1 text-sm text-white/50">
            Panel de gestión: leads, entrega de correos, túneles live y plantillas
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-white/35">
            Actualizado {new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <LogoutButton />
          <AutoRefresh seconds={30} />
        </div>
      </header>

      {!sql ? (
        <div className="mt-10 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-200/90">
          Base de datos no configurada. Define <code className="font-mono text-xs">DATABASE_URL</code>{" "}
          y ejecuta <code className="font-mono text-xs">pnpm db:migrate</code> para ver los leads.
        </div>
      ) : dbError ? (
        <div className="mt-10 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5 text-sm text-rose-200">
          Error al consultar la base de datos. Revisa <code className="font-mono text-xs">DATABASE_URL</code> y
          confirma que la migración esté aplicada (<code className="font-mono text-xs">pnpm db:migrate</code>).
        </div>
      ) : (
        <>
          <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="enterprise-panel rounded-2xl p-4">
              <p className="text-[11px] uppercase tracking-wider text-white/45">Total</p>
              <p className="mt-1 font-display text-2xl text-white">{totalLeads}</p>
            </div>
            {STATUSES.map((key) => (
              <div key={key} className="enterprise-panel rounded-2xl p-4">
                <p className="text-[11px] uppercase tracking-wider text-white/45">
                  {STATUS_LABEL[key]}s
                </p>
                <p className="mt-1 font-display text-2xl text-white">{stats[key]}</p>
              </div>
            ))}
            <div className="enterprise-panel rounded-2xl p-4">
              <p className="text-[11px] uppercase tracking-wider text-white/45">Confirmados</p>
              <p className="mt-1 font-display text-2xl text-emerald-300">{confirmedCount}</p>
            </div>
          </section>

          <nav className="mt-8 flex gap-2 border-b border-white/10">
            <Link
              href="/admin"
              className={`-mb-px border-b-2 px-4 py-2 text-sm transition ${
                tab === "leads"
                  ? "border-brand-purple text-white"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              Leads
            </Link>
            <Link
              href="/admin?tab=eventos"
              className={`-mb-px border-b-2 px-4 py-2 text-sm transition ${
                tab === "eventos"
                  ? "border-brand-purple text-white"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              Eventos de correo
            </Link>
            <Link
              href="/admin?tab=tuneles"
              className={`-mb-px border-b-2 px-4 py-2 text-sm transition ${
                tab === "tuneles"
                  ? "border-brand-purple text-white"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              Túneles live
            </Link>
            <Link
              href="/admin?tab=correo"
              className={`-mb-px border-b-2 px-4 py-2 text-sm transition ${
                tab === "correo"
                  ? "border-brand-purple text-white"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              Correo de confirmación
            </Link>
          </nav>

          {tab === "leads" ? (
            <>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <form method="GET" action="/admin" className="flex items-center gap-2">
                  {status ? <input type="hidden" name="status" value={status} /> : null}
                  <input
                    type="search"
                    name="q"
                    defaultValue={q}
                    placeholder="Buscar por nombre o correo…"
                    className="w-64 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-mist outline-none transition placeholder:text-white/30 focus:border-brand-purple/60"
                  />
                  <button
                    type="submit"
                    className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:border-brand-purple/50 hover:text-white"
                  >
                    Buscar
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={leadsHref({ status: undefined })}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      !status
                        ? "border-brand-purple/60 bg-brand-purple/15 text-white"
                        : "border-white/10 text-white/50 hover:text-white/80"
                    }`}
                  >
                    Todos
                  </Link>
                  {STATUSES.map((key) => (
                    <Link
                      key={key}
                      href={leadsHref({ status: key })}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        status === key
                          ? STATUS_STYLE[key]
                          : "border-white/10 text-white/50 hover:text-white/80"
                      }`}
                    >
                      {STATUS_LABEL[key]}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
                      <th className="px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3 font-medium">Contacto</th>
                      <th className="px-4 py-3 font-medium">Servicio</th>
                      <th className="px-4 py-3 font-medium">Idioma</th>
                      <th className="px-4 py-3 font-medium">Mensaje</th>
                      <th className="px-4 py-3 font-medium">Fechas</th>
                      <th className="px-4 py-3 font-medium">Detalles</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-white/40">
                          {q || status
                            ? "Sin resultados para este filtro."
                            : "Aún no hay leads del formulario."}
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className="align-top transition hover:bg-white/[0.02]">
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded-full border px-2 py-0.5 text-[11px] ${STATUS_STYLE[lead.status]}`}
                            >
                              {STATUS_LABEL[lead.status]}
                            </span>
                            {lead.confirmed_at ? (
                              <span
                                className="mt-1 inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-300"
                                title={`Confirmado: ${formatDate(lead.confirmed_at)}`}
                              >
                                ✓ Confirmado
                              </span>
                            ) : null}
                            {lead.attempts > 0 ? (
                              <span className="mt-1 block text-[10px] text-white/35">
                                {lead.attempts} intento{lead.attempts === 1 ? "" : "s"}
                              </span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-white/90">{lead.payload.name}</p>
                            <a
                              href={`mailto:${lead.payload.email}`}
                              className="text-xs text-brand-light hover:underline"
                            >
                              {lead.payload.email}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-white/70">{lead.payload.service || "—"}</td>
                          <td className="px-4 py-3">
                            <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-white/50">
                              {lead.payload.lang}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <details>
                              <summary className="cursor-pointer list-none text-xs text-white/60 hover:text-brand-light [&::-webkit-details-marker]:hidden">
                                <span className="line-clamp-1 max-w-[18rem]">{lead.payload.message}</span>
                              </summary>
                              <p className="mt-2 max-w-md whitespace-pre-wrap text-xs text-white/75">
                                {lead.payload.message}
                              </p>
                            </details>
                          </td>
                          <td className="px-4 py-3 text-[11px] leading-5 text-white/45">
                            <span className="block">Creado: {formatDate(lead.created_at)}</span>
                            {lead.sent_at ? (
                              <span className="block">Enviado: {formatDate(lead.sent_at)}</span>
                            ) : null}
                            {lead.delivered_at ? (
                              <span className="block">Entregado: {formatDate(lead.delivered_at)}</span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            {lead.last_error ? (
                              <span
                                className="line-clamp-2 block max-w-[14rem] text-[11px] text-rose-300/80"
                                title={lead.last_error}
                              >
                                {lead.last_error}
                              </span>
                            ) : null}
                            {lead.resend_email_id ? (
                              <span
                                className="mt-1 block max-w-[10rem] truncate font-mono text-[10px] text-white/35"
                                title={lead.resend_email_id}
                              >
                                {lead.resend_email_id}
                              </span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            <DeleteLeadButton id={lead.id} label={lead.payload.email} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {total > PAGE_SIZE ? (
                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <span>
                    Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} de {total}
                  </span>
                  <div className="flex gap-2">
                    {page > 1 ? (
                      <Link
                        href={leadsHref({ page: String(page - 1) })}
                        className="rounded-lg border border-white/15 px-3 py-1.5 transition hover:border-brand-purple/50 hover:text-white"
                      >
                        ← Anterior
                      </Link>
                    ) : null}
                    {page < totalPages ? (
                      <Link
                        href={leadsHref({ page: String(page + 1) })}
                        className="rounded-lg border border-white/15 px-3 py-1.5 transition hover:border-brand-purple/50 hover:text-white"
                      >
                        Siguiente →
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          ) : tab === "tuneles" ? (
            <div className="mt-6">
              <LiveProjectsManager
                projects={liveProjects.map((p) => ({
                  name: p.name,
                  url: p.url,
                  updatedAt: formatDate(p.updated_at),
                }))}
              />
            </div>
          ) : tab === "correo" ? (
            <div className="mt-6">
              <EmailTemplateEditor
                initial={
                  emailTemplateInfo
                    ? {
                        templates: emailTemplateInfo.templates,
                        source: emailTemplateInfo.source,
                        updatedAt: emailTemplateInfo.updatedAt
                          ? emailTemplateInfo.updatedAt.toISOString()
                          : null,
                      }
                    : {
                        templates: {
                          en: getDefaultTemplate("confirmation", "en"),
                          es: getDefaultTemplate("confirmation", "es"),
                        },
                        source: "defaults" as const,
                        updatedAt: null,
                      }
                }
              />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Email ID</th>
                    <th className="px-4 py-3 font-medium">Recibido</th>
                    <th className="px-4 py-3 font-medium">Evento (svix)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-white/40">
                        Aún no hay eventos de webhook registrados.
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (
                      <tr key={event.svix_id} className="align-top transition hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono text-xs text-brand-light">{event.type}</td>
                        <td className="px-4 py-3 font-mono text-xs text-white/60">
                          {event.email_id ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-white/45">
                          {formatDate(event.received_at)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="block max-w-[16rem] truncate font-mono text-[10px] text-white/30" title={event.svix_id}>
                            {event.svix_id}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}
