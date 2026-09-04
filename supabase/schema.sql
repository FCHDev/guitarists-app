-- Schéma initial Supabase pour guitarist-app (migration depuis Firebase
-- Realtime Database, 2026-09-04). À coller une seule fois dans le SQL
-- Editor du dashboard Supabase (Project > SQL Editor > New query > Run).

create table if not exists public.guitarists (
  id bigint generated always as identity primary key,
  nom text not null,
  prenom text,
  nationalite text,
  ville text,
  annee_naissance int,
  annee_mort int,
  mort boolean not null default false,
  area text,
  bio text,
  bio2 text,
  bio3 text,
  bio4 text,
  img_url text,
  wiki text,
  yt_ref text,
  created_at timestamptz not null default now()
);

-- RLS : équivalent exact de la règle Firebase actuelle
-- (.read: true, .write: "auth != null").
alter table public.guitarists enable row level security;

create policy "Lecture publique"
  on public.guitarists
  for select
  to anon, authenticated
  using (true);

create policy "Écriture réservée aux comptes connectés"
  on public.guitarists
  for all
  to authenticated
  using (true)
  with check (true);

-- Realtime : nécessaire pour que l'app se mette à jour toute seule après un
-- ajout/modification/suppression depuis l'admin (équivalent de l'écoute
-- Firebase onValue continue).
alter publication supabase_realtime add table public.guitarists;
