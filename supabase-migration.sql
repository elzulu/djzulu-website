-- ============================================================
--  DJZULU — Supabase Migration
--  Ejecuta esto en: supabase.com > tu proyecto > SQL Editor
-- ============================================================

-- 1. EVENTOS
create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  lugar text,
  fecha date not null,
  tipo text check (tipo in ('fiesta','corporativo','boda','quinceañera','festival','club','otro')) default 'otro',
  portada_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  publicado boolean default true
);

-- 2. MEDIA (fotos y videos de cada evento)
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid references eventos(id) on delete cascade,
  tipo text check (tipo in ('video','imagen')) not null,
  url text not null,
  nombre_original text,
  duracion_seg int,
  orden int default 0,
  created_at timestamptz default now()
);

-- 3. SERVICIOS
create table if not exists servicios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  icono text default 'music',
  orden int default 0,
  activo boolean default true
);

-- 4. PLANES DE PRECIOS
create table if not exists precios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  precio text not null,
  periodo text,
  destacado boolean default false,
  features jsonb default '[]',
  orden int default 0,
  activo boolean default true
);

-- 5. CONFIGURACION GENERAL (nombre, bio, redes)
create table if not exists config (
  clave text primary key,
  valor text
);

-- Insertar config por defecto
insert into config (clave, valor) values
  ('nombre_artistico', 'DJ Zulu'),
  ('tagline', 'Events & Media'),
  ('descripcion', 'Sets únicos para fiestas, eventos corporativos y shows en vivo. Tu evento merece el mejor sonido de Medellín.'),
  ('ciudad', 'Medellín, Colombia'),
  ('whatsapp', '573053070865'),
  ('youtube_url', 'https://youtube.com/@elzulu_oficial'),
  ('tiktok_url', 'https://www.tiktok.com/@zulu.events.media'),
  ('eventos_count', '120+'),
  ('anos_experiencia', '8'),
  ('logo_url', '')
on conflict (clave) do nothing;

-- Insertar servicios por defecto
insert into servicios (nombre, descripcion, icono, orden) values
  ('Fiestas & Eventos privados', 'Cumpleaños, quinceañeras, bodas y reuniones. Sets personalizados según tu playlist y ambiente.', 'music', 1),
  ('Eventos corporativos', 'Lanzamientos, premiaciones y cocteles empresariales con ambiente profesional y elegante.', 'briefcase', 2),
  ('Shows & Crossover', 'Experiencia completa con iluminación, efectos visuales y transiciones únicas para shows especiales.', 'zap', 3)
on conflict do nothing;

-- Insertar precios por defecto
insert into precios (nombre, precio, periodo, destacado, features, orden) values
  ('Básico', '$350.000', 'hasta 3 horas · Medellín', false, '["Equipo de sonido", "Música personalizada", "1 set continuo"]', 1),
  ('Premium', '$650.000', 'hasta 6 horas · Antioquia', true, '["Todo lo del básico", "Iluminación LED", "Video reel del evento", "Sets ilimitados"]', 2),
  ('Corporativo', 'A convenir', 'según requerimientos', false, '["Todo lo del premium", "Sonido profesional", "Shows visuales", "Contrato formal"]', 3)
on conflict do nothing;

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================

alter table eventos enable row level security;
alter table media enable row level security;
alter table servicios enable row level security;
alter table precios enable row level security;
alter table config enable row level security;

-- Lectura pública para todo
create policy "public read eventos" on eventos for select using (publicado = true);
create policy "public read media" on media for select using (true);
create policy "public read servicios" on servicios for select using (activo = true);
create policy "public read precios" on precios for select using (activo = true);
create policy "public read config" on config for select using (true);

-- Escritura solo para usuarios autenticados (admin)
create policy "auth write eventos" on eventos for all using (auth.role() = 'authenticated');
create policy "auth write media" on media for all using (auth.role() = 'authenticated');
create policy "auth write servicios" on servicios for all using (auth.role() = 'authenticated');
create policy "auth write precios" on precios for all using (auth.role() = 'authenticated');
create policy "auth write config" on config for all using (auth.role() = 'authenticated');

-- ============================================================
--  STORAGE BUCKETS
--  Ejecuta también esto para crear los buckets de archivos
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict do nothing;

-- Políticas de storage
create policy "public read media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "auth upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "auth delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "public read logos"
  on storage.objects for select
  using (bucket_id = 'logos');

create policy "auth upload logos"
  on storage.objects for insert
  with check (bucket_id = 'logos' and auth.role() = 'authenticated');
