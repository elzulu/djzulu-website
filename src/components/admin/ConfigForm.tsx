'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { UploadCloud } from 'lucide-react'
import NextImage from 'next/image'

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
  { key: 'instagram_url', label: 'URL de Instagram', placeholder: 'https://www.instagram.com/elzulu_oficial/' },
  { key: 'eventos_count', label: 'Número de eventos (estadística hero)', placeholder: '200+' },
  { key: 'anos_experiencia', label: 'Años de experiencia', placeholder: '4' },
  { key: 'generos', label: 'Géneros musicales (separados por coma)', placeholder: 'Electrónica, Urbano, Crossover, Merengue, Open Format' },
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

  async function uploadFile(
    file: File,
    pathPrefix: string,
    configKey: string,
    setUploading: (v: boolean) => void,
    successMsg: string,
  ) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${pathPrefix}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
    if (uploadError) { toast.error('Error subiendo archivo'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)
    const { error: dbError } = await supabase.from('config').upsert({ clave: configKey, valor: publicUrl }, { onConflict: 'clave' })
    if (dbError) { toast.error('Error guardando URL'); setUploading(false); return }
    setForm(f => ({ ...f, [configKey]: publicUrl }))
    toast.success(successMsg)
    setUploading(false)
    router.refresh()
  }

  function onFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    pathPrefix: string,
    configKey: string,
    setUploading: (v: boolean) => void,
    successMsg: string,
  ) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file, pathPrefix, configKey, setUploading, successMsg)
  }

  return (
    <form onSubmit={save} style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Logo uploader */}
      <div style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 10, padding: 20 }}>
        <label style={labelStyle}>LOGO DEL SITIO</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {form.logo_url ? (
            <NextImage src={form.logo_url} alt="Logo" width={60} height={60} style={{ objectFit: 'contain', borderRadius: 8, border: '1px solid rgba(0,180,255,0.2)' }} />
          ) : (
            <div style={{ width: 60, height: 60, borderRadius: 8, background: 'rgba(0,180,255,0.08)', border: '1px dashed rgba(0,180,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={20} color="rgba(0,180,255,0.4)" />
            </div>
          )}
          <label style={{ cursor: 'pointer', fontSize: 13, color: '#00b4ff', fontWeight: 600, letterSpacing: 1 }}>
            {logoUploading ? 'SUBIENDO...' : 'SUBIR LOGO'}
            <input type="file" accept="image/*" onChange={e => onFileChange(e, 'logo', 'logo_url', setLogoUploading, 'Logo actualizado ✓')} style={{ display: 'none' }} disabled={logoUploading} />
          </label>
        </div>
      </div>

      {/* Press Kit foto uploader */}
      <div style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 10, padding: 20 }}>
        <label style={labelStyle}>FOTO PRESS KIT</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {form.presskit_foto_url ? (
            <NextImage src={form.presskit_foto_url} alt="Press Kit" width={60} height={60} style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(0,180,255,0.2)' }} />
          ) : (
            <div style={{ width: 60, height: 60, borderRadius: 8, background: 'rgba(0,180,255,0.08)', border: '1px dashed rgba(0,180,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={20} color="rgba(0,180,255,0.4)" />
            </div>
          )}
          <label style={{ cursor: 'pointer', fontSize: 13, color: '#00b4ff', fontWeight: 600, letterSpacing: 1 }}>
            {presskitUploading ? 'SUBIENDO...' : 'SUBIR FOTO'}
            <input type="file" accept="image/*" onChange={e => onFileChange(e, 'presskit-foto', 'presskit_foto_url', setPresskitUploading, 'Foto del Press Kit actualizada ✓')} style={{ display: 'none' }} disabled={presskitUploading} />
          </label>
        </div>
      </div>

      {/* Foto de perfil uploader */}
      <div style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 10, padding: 20 }}>
        <label style={labelStyle}>FOTO DE PERFIL (sección Sobre Mí)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {form.foto_perfil_url ? (
            <NextImage src={form.foto_perfil_url} alt="Foto de perfil" width={60} height={60} style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(0,180,255,0.2)' }} />
          ) : (
            <div style={{ width: 60, height: 60, borderRadius: 8, background: 'rgba(0,180,255,0.08)', border: '1px dashed rgba(0,180,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={20} color="rgba(0,180,255,0.4)" />
            </div>
          )}
          <label style={{ cursor: 'pointer', fontSize: 13, color: '#00b4ff', fontWeight: 600, letterSpacing: 1 }}>
            {fotoUploading ? 'SUBIENDO...' : 'SUBIR FOTO'}
            <input type="file" accept="image/*" onChange={e => onFileChange(e, 'foto-perfil', 'foto_perfil_url', setFotoUploading, 'Foto de perfil actualizada ✓')} style={{ display: 'none' }} disabled={fotoUploading} />
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
