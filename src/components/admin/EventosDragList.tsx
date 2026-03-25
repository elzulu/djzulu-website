'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Pencil, GripVertical } from 'lucide-react'
import { formatFecha, tipoLabel } from '@/lib/utils'
import DeleteEventoBtn from './DeleteEventoBtn'
import TogglePublicadoBtn from './TogglePublicadoBtn'
import toast from 'react-hot-toast'
import type { Evento } from '@/types'

export default function EventosDragList({ initial }: { initial: Evento[] }) {
  const supabase = createClient()
  const [eventos, setEventos] = useState(initial)
  const dragIdx = useRef<number | null>(null)

  function onDragStart(i: number) { dragIdx.current = i }

  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    const from = dragIdx.current
    if (from === null || from === i) return
    const next = [...eventos]
    const [item] = next.splice(from, 1)
    next.splice(i, 0, item)
    dragIdx.current = i
    setEventos(next)
  }

  async function onDrop() {
    dragIdx.current = null
    const updates = eventos.map((ev, i) => supabase.from('eventos').update({ orden: i }).eq('id', ev.id))
    await Promise.all(updates)
    toast.success('Orden guardado ✓')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {eventos.map((evento, i) => (
        <div key={evento.id}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => onDragOver(e, i)}
          onDrop={onDrop}
          style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.12)', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', cursor: 'grab', userSelect: 'none' }}>
          <div style={{ color: 'rgba(255,255,255,0.2)', cursor: 'grab', flexShrink: 0 }}>
            <GripVertical size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{evento.titulo}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
              {tipoLabel(evento.tipo)} · {evento.lugar ?? '—'} · {formatFecha(evento.fecha)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TogglePublicadoBtn id={evento.id} publicado={evento.publicado} />
            <Link href={`/admin/eventos/${evento.id}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: '1px solid rgba(0,180,255,0.25)', borderRadius: 6, textDecoration: 'none', color: '#00b4ff', fontSize: 12, fontWeight: 600 }}>
              <Pencil size={13} /> Editar
            </Link>
            <DeleteEventoBtn id={evento.id} titulo={evento.titulo} />
          </div>
        </div>
      ))}
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 4 }}>
        Arrastra para reordenar · El orden se guarda automáticamente al soltar
      </p>
    </div>
  )
}
