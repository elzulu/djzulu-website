import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Evento } from '@/types'
import { PlusCircle } from 'lucide-react'
import EventosDragList from '@/components/admin/EventosDragList'

export default async function EventosAdmin() {
  const supabase = createClient()
  const { data } = await supabase.from('eventos').select('*').order('orden', { ascending: true }).order('fecha', { ascending: false })
  const eventos = (data ?? []) as Evento[]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Eventos</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{eventos.length} eventos en total</p>
        </div>
        <Link href="/admin/eventos/nuevo"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'linear-gradient(90deg,#00b4ff,#b44fff)', borderRadius: 6, textDecoration: 'none', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
          <PlusCircle size={15} /> Nuevo evento
        </Link>
      </div>

      {eventos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.25)', fontSize: 15 }}>
          No hay eventos aún. Crea el primero 👆
        </div>
      ) : (
        <EventosDragList initial={eventos} />
      )}
    </div>
  )
}
