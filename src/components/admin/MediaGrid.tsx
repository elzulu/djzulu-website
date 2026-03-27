'use client'
import Image from 'next/image'
import { Trash2, Film, ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface MediaItem {
  id: string
  tipo: 'video' | 'imagen'
  url: string
  nombre_original?: string
  created_at: string
  eventos?: { titulo: string } | null
}

export default function MediaGrid({ media }: { media: MediaItem[] }) {
  const supabase = createClient()
  const router = useRouter()

  async function deleteMedia(item: MediaItem) {
    if (!confirm(`¿Eliminar ${item.nombre_original ?? 'este archivo'}?`)) return

    // Extract storage path from URL
    const urlParts = item.url.split('/media/')
    const storagePath = urlParts[1]

    if (storagePath) {
      await supabase.storage.from('media').remove([storagePath])
    }
    const { error } = await supabase.from('media').delete().eq('id', item.id)
    if (error) toast.error('Error al eliminar')
    else { toast.success('Archivo eliminado'); router.refresh() }
  }

  if (media.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
      No hay archivos subidos todavía.
    </div>
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
      {media.map(item => (
        <div key={item.id} style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.1)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
          {/* Preview */}
          <div style={{ aspectRatio: '1/1', background: '#111', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {item.tipo === 'imagen' ? (
              <Image src={item.url} alt={item.nombre_original ?? ''} fill style={{ objectFit: 'cover' }} sizes="200px" />
            ) : (
              <>
                <video src={item.url} preload="none" style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <Film size={28} color="rgba(255,255,255,0.4)" />
                </div>
              </>
            )}
            {/* Type badge */}
            <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
              {item.tipo === 'video' ? <Film size={10} color="#b44fff" /> : <ImageIcon size={10} color="#00b4ff" />}
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 }}>{item.tipo}</span>
            </div>
          </div>
          {/* Info */}
          <div style={{ padding: '8px 10px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
              {item.nombre_original ?? 'archivo'}
            </div>
            {item.eventos && (
              <div style={{ fontSize: 10, color: 'rgba(0,180,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.eventos.titulo}
              </div>
            )}
          </div>
          {/* Delete */}
          <button onClick={() => deleteMedia(item)}
            style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, background: 'rgba(255,50,50,0.8)', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={12} color="white" />
          </button>
        </div>
      ))}
    </div>
  )
}
