'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { UploadCloud } from 'lucide-react'

const FIELDS = [
  { key: 'nombre_artistico', label: 'Nombre artístico', placeholder: 'DJ Zulu' },
  { key: 'nombre_real', label: 'Nombre real', placeholder: 'Jose Zuluaga' },
  { key: 'tagline', label: 'Subtítulo (tagline)', placeholder: 'Events & Media' },
  { key: 'descripcion', label: 'Descripción del hero', placeholder: 'Sets únicos para fiestas...', multiline: true },
  { key: 'bio', label: 'Biografía (sección Sobre Mí)', placeholder: 'Cuéntale a tus clientes tu historia...', multiline: true },
  { key: 'ciudad', label: 'Ciudad / Cobertura', placeholder: 'Rionegro · Oriente Antioqueño' },
  { key: 'whatsapp', label: 'WhatsApp (con código país, sin +)', placeholder: '573001234567' },
  { key: 'youtube_url', label: 'URL de YouTube', placeholder: 'https://youtube.com/@elzulu_oficial' },
  { key: 'tiktok_url', label: 'URL de TikTok', placeholder: 'https://tiktok.com/@zulu.events.media' },
  { key: 'eventos_count', label: 'Número de eventos (estadística hero)', placeholder: '200+' },
  { key: 'anos_experiencia', label: 'Años de experiencia', placeholder: '4' },
]

export default function ConfigForm({ config }: { config: Record<string, string> }) {
  const supabase = createClient()
  const router = useRouter()
  const [form, setForm] = useState<Record<string, string>>(config)
  const [loading, setLoading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [fotoUploading, setFotoUploading] = useState(false)
  const [presskitUploading, setPresskitUploading] = useState(false)

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 6, padding: '11px 14px', color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'Rajdhani, sans-serif' }
  const labelStyle = { fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block' as const, marginBottom: 6 }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const updates = Object.entries(form).map(([clave, valor]) => ({ clave, valor }))
    const { error } = await supabase.from('config').upsert(updates, { onConflict: 'clave' })
    if (error) toast.error('Error al guardar')
    else { toast.success('Configuración guardada ✓'); router.refresh() }
    setLoading(false)
  }

  async function uploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoUploading(true)
    const ext = file.name.split('.').pop()
    const path = `foto-perfil-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
    if (error) { toast.error('Error subiendo foto'); setFotoUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)
    setForm(f => ({ ...f, foto_perfil_url: publicUrl }))
    await supabase.from('config').upsert({ clave: 'foto_perfil_url', valor: publicUrl }, { onConflict: 'clave' })
    toast.success('Foto de perfil actualizada ✓')
    setFotoUploading(false)
    router.refresh()
  }

  async function uploadPresskit(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPresskitUploading(true)
    const ext = file.name.split('.').pop()
    const path = `presskit-foto-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
    if (error) { toast.error('Error subiendo foto'); setPresskitUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)
    setForm(f => ({ ...f, presskit_foto_url: publicUrl }))
    await supabase.from('config').upsert({ clave: 'presskit_foto_url', valor: publicUrl }, { onConflict: 'clave' })
    toast.success('Foto del Press Kit actualizada ✓')
    setPresskitUploading(false)
    router.refresh()
  }

  async function uploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    const ext = file.name.split('.').pop()
    const path = `logo-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
    if (error) { toast.error('Error subiendo logo'); setLogoUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)
    setForm(f => ({ ...f, logo_url: publicUrl }))
    await supabase.from('config').upsert({ clave: 'logo_url', valor: publicUrl }, { onConflict: 'clave' })
    toast.success('Logo actualizado ✓')
    setLogoUploading(false)
    router.refresh()
  }

  return (
    <form onSubmit={save} style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Logo uploader */}
      <div style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 10, padding: 20 }}>
        <label style={labelStyle}>LOGO DEL SITIO</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {form.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.logo_url} alt="Logo" style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, border: '1px solid rgba(0,180,255,0.2)' }} />
          ) : (
            <div style={{ width: 60, height: 60, borderRadius: 8, background: 'rgba(0,180,255,0.08)', border: '1px dashed rgba(0,180,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={20} color="rgba(0,180,255,0.4)" />
            </div>
          )}
          <label style={{ cursor: 'pointer', fontSize: 13, color: '#00b4ff', fontWeight: 600, letterSpacing: 1 }}>
            {logoUploading ? 'SUBIENDO...' : 'SUBIR LOGO'}
            <input type="file" accept="image/*" onChange={uploadLogo} style={{ display: 'none' }} disabled={logoUploading} />
          </label>
        </div>
      </div>

      {/* Press Kit foto uploader */}
      <div style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 10, padding: 20 }}>
        <label style={labelStyle}>FOTO PRESS KIT</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {form.presskit_foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.presskit_foto_url} alt="Press Kit" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(0,180,255,0.2)' }} />
          ) : (
            <div style={{ width: 60, height: 60, borderRadius: 8, background: 'rgba(0,180,255,0.08)', border: '1px dashed rgba(0,180,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={20} color="rgba(0,180,255,0.4)" />
            </div>
          )}
          <label style={{ cursor: 'pointer', fontSize: 13, color: '#00b4ff', fontWeight: 600, letterSpacing: 1 }}>
            {presskitUploading ? 'SUBIENDO...' : 'SUBIR FOTO'}
            <input type="file" accept="image/*" onChange={uploadPresskit} style={{ display: 'none' }} disabled={presskitUploading} />
          </label>
        </div>
      </div>

      {/* Foto de perfil uploader */}
      <div style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 10, padding: 20 }}>
        <label style={labelStyle}>FOTO DE PERFIL (sección Sobre Mí)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {form.foto_perfil_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.foto_perfil_url} alt="Foto de perfil" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(0,180,255,0.2)' }} />
          ) : (
            <div style={{ width: 60, height: 60, borderRadius: 8, background: 'rgba(0,180,255,0.08)', border: '1px dashed rgba(0,180,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={20} color="rgba(0,180,255,0.4)" />
            </div>
          )}
          <label style={{ cursor: 'pointer', fontSize: 13, color: '#00b4ff', fontWeight: 600, letterSpacing: 1 }}>
            {fotoUploading ? 'SUBIENDO...' : 'SUBIR FOTO'}
            <input type="file" accept="image/*" onChange={uploadFoto} style={{ display: 'none' }} disabled={fotoUploading} />
          </label>
        </div>
      </div>

      {/* Fields */}
      {FIELDS.map(f => (
        <div key={f.key}>
          <label style={labelStyle}>{f.label.toUpperCase()}</label>
          {f.multiline ? (
            <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
              value={form[f.key] ?? ''} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              placeholder={f.placeholder} />
          ) : (
            <input style={inputStyle} value={form[f.key] ?? ''}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              placeholder={f.placeholder} />
          )}
        </div>
      ))}

      <button type="submit" disabled={loading}
        style={{ padding: '13px', borderRadius: 6, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Rajdhani, sans-serif' }}>
        {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
      </button>
    </form>
  )
}
