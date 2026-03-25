import { createClient } from '@/lib/supabase/server'
import type { Evento } from '@/types'
import MediaUploader from '@/components/admin/MediaUploader'
import MediaGrid from '@/components/admin/MediaGrid'

export default async function GaleriaAdmin() {
  const supabase = createClient()

  const [eventosRes, mediaRes] = await Promise.all([
    supabase.from('eventos').select('id, titulo, fecha').order('fecha', { ascending: false }),
    supabase.from('media').select('*, eventos(titulo)').order('created_at', { ascending: false }),
  ])

  const eventos = (eventosRes.data ?? []) as Pick<Evento, 'id' | 'titulo' | 'fecha'>[]
  const media = mediaRes.data ?? []

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Galería
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
          Sube fotos y videos desde tu PC — aparecen en el sitio web al instante
        </p>
      </div>

      <MediaUploader eventos={eventos} />

      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
          ARCHIVOS SUBIDOS ({media.length})
        </h2>
        <MediaGrid media={media} />
      </div>
    </div>
  )
}
