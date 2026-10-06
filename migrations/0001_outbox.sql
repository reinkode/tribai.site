-- Outbox for contact-form emails + audit log of Resend webhook events.
-- Idempotent: safe to re-run. Apply with: pnpm db:migrate

create table if not exists outbox (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'contact',
  payload jsonb not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'delivered', 'failed')),
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_error text,
  resend_email_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  delivered_at timestamptz
);

create index if not exists outbox_due_idx on outbox (status, next_attempt_at);

create table if not exists webhook_events (
  svix_id text primary key,
  type text not null,
  email_id text,
  payload jsonb not null,
  received_at timestamptz not null default now()
);
