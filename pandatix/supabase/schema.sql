-- Jalankan sekali di Supabase SQL Editor.
create table if not exists public.pandatix_state (
  id integer primary key check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.pandatix_state enable row level security;

-- Aplikasi mengakses tabel ini hanya dari server memakai SERVICE ROLE KEY.
-- Jangan membuat policy publik dan jangan memasukkan service role key ke frontend.
create or replace function public.pandatix_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pandatix_state_updated_at on public.pandatix_state;
create trigger pandatix_state_updated_at
before update on public.pandatix_state
for each row execute function public.pandatix_touch_updated_at();
