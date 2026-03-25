import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CalendarDays, ImageIcon, Eye, PlusCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createClient()

  const [eventosRes, mediaRes] = await Promise.all([
    supabase.from('eventos').select('id, publicado', { count: 'exact' }),
    supabase.from('media').select('id', { count: 'exact' }),
  ])

  const totalEventos = eventosRes.count ?? 0
  const totalMedia = mediaRes.count ?? 0
  const publicados = eventosRes.data?.filter(e => e.publicado).length ?? 0

  const stats = [
    { label: 'Eventos totales', value: totalEventos, icon: CalendarDays, color: '#00b4ff' },
    { label: 'Publicados', value: publicados, icon: Eye, color: '#b44fff' },
    { label: 'Archivos de media', value: totalMedia, icon: ImageIcon, color: '#25d366' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Panel de control de tu sitio web</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 36 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.12)', borderRadius: 10, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5 }}>{s.label}</div>
              <s.icon size={16} color={s.color} />
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>ACCIONES RÁPIDAS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
          <Link href="/admin/eventos/nuevo"
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 10, textDecoration: 'none', color: '#00b4ff', fontSize: 14, fontWeight: 600 }}>
            <PlusCircle size={18} />
            Nuevo evento
          </Link>
          <Link href="/admin/galeria"
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'rgba(180,79,255,0.08)', border: '1px solid rgba(180,79,255,0.2)', borderRadius: 10, textDecoration: 'none', color: '#b44fff', fontSize: 14, fontWeight: 600 }}>
            <ImageIcon size={18} />
            Subir media
          </Link>
          <Link href="/" target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 10, textDecoration: 'none', color: '#25d366', fontSize: 14, fontWeight: 600 }}>
            <Eye size={18} />
            Ver sitio web
          </Link>
        </div>
      </div>

      <div style={{ padding: '20px', background: 'rgba(0,180,255,0.04)', border: '1px solid rgba(0,180,255,0.1)', borderRadius: 10 }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
          💡 <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Tip:</strong> Crea un evento, sube sus fotos y videos desde "Galería", y se publicará automáticamente en tu sitio web en segundos.
        </p>
      </div>
    </div>
  )
}
