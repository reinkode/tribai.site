create table if not exists email_templates (
  key text not null,
  lang text not null,
  subject text not null,
  html text not null,
  updated_at timestamptz not null default now(),
  primary key (key, lang)
);
