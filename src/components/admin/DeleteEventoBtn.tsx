'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

export default function DeleteEventoBtn({ id, titulo }: { id: string; titulo: string }) {
  const supabase = createClient()
  const router = useRouter()

  async function handle() {
    if (!confirm(`¿Eliminar el evento "${titulo}"? Esto también borrará toda su media.`)) return
    const { error } = await supabase.from('eventos').delete().eq('id', id)
    if (error) toast.error('Error al eliminar')
    else { toast.success('Evento eliminado'); router.refresh() }
  }

  return (
    <button onClick={handle}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: '1px solid rgba(255,85,85,0.25)', borderRadius: 6, background: 'transparent', color: 'rgba(255,85,85,0.7)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
      <Trash2 size={13} /> Eliminar
    </button>
  )
}
