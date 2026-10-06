-- Live tunnel registry: /live/:project proxies to the stored URL (e.g. an ngrok tunnel).
-- Managed from the admin dashboard (Túneles tab). Idempotent: safe to re-run.

create table if not exists live_projects (
  name text primary key,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
