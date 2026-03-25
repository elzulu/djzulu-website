# 🎵 DJ Zulu — Sitio Web

Sitio web profesional con panel de administración para subir eventos, fotos y videos.

---

## 🚀 Pasos para poner en marcha

### 1. Instalar dependencias

```bash
npm install
```

---

### 2. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto gratis
2. En tu proyecto, ve a **SQL Editor** y pega todo el contenido de `supabase-migration.sql` → ejecuta
3. Ve a **Settings → API** y copia:
   - `Project URL`
   - `anon public` key

4. Edita el archivo `.env.local` con tus datos:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_key
ADMIN_EMAIL=tu@email.com
```

---

### 3. Crear tu usuario de admin

1. En Supabase ve a **Authentication → Users**
2. Clic en **"Invite user"** o **"Add user"**
3. Usa el mismo email que pusiste en `ADMIN_EMAIL`
4. Ponle una contraseña

---

### 4. Correr en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

### 5. Subir a Vercel

```bash
# Opción A: desde CLI
npm i -g vercel
vercel

# Opción B: desde vercel.com
# 1. Sube tu proyecto a GitHub
# 2. En vercel.com → "New Project" → importa el repo
# 3. En "Environment Variables" agrega las mismas variables de .env.local
# 4. Deploy ✓
```

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              ← Página principal pública
│   ├── admin/
│   │   ├── page.tsx          ← Dashboard admin
│   │   ├── login/page.tsx    ← Login admin
│   │   ├── eventos/          ← CRUD de eventos
│   │   ├── galeria/          ← Subir fotos/videos
│   │   └── config/           ← Configurar sitio
├── components/
│   ├── layout/               ← Componentes públicos
│   └── admin/                ← Componentes del panel
├── lib/
│   ├── supabase/             ← Clientes de Supabase
│   └── utils.ts
└── types/index.ts
```

---

## 🎛️ Cómo subir un evento

1. Entra a `/admin` con tu email y contraseña
2. Ve a **Eventos → Nuevo evento**
3. Completa el formulario (título, fecha, lugar, tipo)
4. Ve a **Galería**
5. Selecciona el evento, arrastra tus fotos/videos desde el PC
6. Clic en "Subir archivos"
7. ¡Listo! Aparece en tu sitio web en segundos

---

## 🔧 Personalizar contenido

- Textos del hero, WhatsApp, YouTube, TikTok → **Admin → Configuración**
- Servicios y precios → edítalos directo en **Supabase → Table Editor → servicios / precios**

---

## 📦 Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animaciones)
- **Supabase** (base de datos + auth + storage)
- **Vercel** (deploy)
