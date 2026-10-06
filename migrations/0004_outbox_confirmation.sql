alter table outbox add column if not exists confirm_token text;
alter table outbox add column if not exists confirmed_at timestamptz;

-- Unique index doubles as the token lookup; NULLs are allowed multiple times.
create unique index if not exists outbox_confirm_token_idx on outbox (confirm_token);
