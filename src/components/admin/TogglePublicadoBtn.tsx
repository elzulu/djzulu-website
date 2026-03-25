'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function TogglePublicadoBtn({ id, publicado }: { id: string; publicado: boolean }) {
  const supabase = createClient()
  const router = useRouter()

  async function toggle() {
    const { error } = await supabase.from('eventos').update({ publicado: !publicado }).eq('id', id)
    if (error) toast.error('Error')
    else { toast.success(publicado ? 'Evento ocultado' : 'Evento publicado ✓'); router.refresh() }
  }

  return (
    <button onClick={toggle}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: `1px solid ${publicado ? 'rgba(37,211,102,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, background: 'transparent', color: publicado ? '#25d366' : 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
      {publicado ? <><Eye size={13} /> Público</> : <><EyeOff size={13} /> Oculto</>}
    </button>
  )
}
