import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EventoForm from '@/components/admin/EventoForm'
import type { Evento } from '@/types'

export default async function EditarEventoPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data } = await supabase.from('eventos').select('*').eq('id', params.id).single()
  if (!data) notFound()

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Editar Evento
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{data.titulo}</p>
      </div>
      <EventoForm evento={data as Evento} />
    </div>
  )
}
