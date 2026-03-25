'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Evento, TipoEvento } from '@/types'
import { Eye, X, UploadCloud } from 'lucide-react'
import { tipoLabel, formatFecha } from '@/lib/utils'

const TIPOS: TipoEvento[] = ['fiesta', 'corporativo', 'boda', 'quinceañera', 'festival', 'club', 'otro']

interface Props { evento?: Evento }

function PreviewModal({ form, onClose }: { form: { titulo: string; lugar: string; fecha: string; tipo: string; descripcion: string }; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#07071a', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 12, maxWidth: 480, width: '100%', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 2, color: '#00b4ff' }}>VISTA PREVIA</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Card preview */}
        <div style={{ position: 'relative', aspectRatio: '9/16', borderRadius: 10, overflow: 'hidden', background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', maxHeight: 380 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,#1a0550 0%,#07071a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="60" height="60" viewBox="0 0 60 60" opacity={0.2}>
              <circle cx="30" cy="30" r="26" stroke="#00b4ff" strokeWidth="1" fill="none"/>
              <circle cx="30" cy="30" r="12" stroke="#b44fff" strokeWidth="1" fill="none"/>
              <circle cx="30" cy="30" r="4" fill="#00b4ff"/>
            </svg>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(7,7,26,0.88) 0%,rgba(7,7,26,0.1) 50%,transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#00b4ff', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>
              {tipoLabel(form.tipo as TipoEvento)}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{form.titulo || 'Título del evento'}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{form.fecha ? formatFecha(form.fecha) : 'Fecha'}</div>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 16, background: 'rgba(0,180,255,0.04)', borderRadius: 8, border: '1px solid rgba(0,180,255,0.1)' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: '#00b4ff', marginBottom: 8 }}>{tipoLabel(form.tipo as TipoEvento)}</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 2 }}>{form.titulo || 'Título del evento'}</div>
          {form.lugar && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{form.lugar} · {form.fecha ? formatFecha(form.fecha) : '—'}</div>}
          {form.descripcion && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginTop: 10 }}>{form.descripcion}</p>}
        </div>
      </div>
    </div>
  )
}

export default function EventoForm({ evento }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = !!evento
  const [preview, setPreview] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)
  const [coverUploading, setCoverUploading] = useState(false)

  const [form, setForm] = useState({
    titulo: evento?.titulo ?? '',
    descripcion: evento?.descripcion ?? '',
    lugar: evento?.lugar ?? '',
    fecha: evento?.fecha ?? '',
    tipo: evento?.tipo ?? 'fiesta' as TipoEvento,
    publicado: evento?.publicado ?? true,
    portada_url: evento?.portada_url ?? '',
  })
  const [loading, setLoading] = useState(false)

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    const ext = file.name.split('.').pop()
    const path = `covers/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (error) { toast.error('Error subiendo portada'); setCoverUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
    setForm(f => ({ ...f, portada_url: publicUrl }))
    toast.success('Portada subida ✓')
    setCoverUploading(false)
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,255,0.2)',
    borderRadius: 6, padding: '11px 14px', color: '#fff', fontSize: 15, outline: 'none',
    fontFamily: 'Rajdhani, sans-serif',
  }
  const labelStyle = { fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block' as const, marginBottom: 6 }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titulo || !form.fecha) return toast.error('Título y fecha son requeridos')
    setLoading(true)

    const payload = { ...form }
    let error = null

    if (isEdit) {
      const res = await supabase.from('eventos').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', evento.id)
      error = res.error
    } else {
      const res = await supabase.from('eventos').insert(payload)
      error = res.error
    }

    if (error) {
      toast.error('Error al guardar: ' + error.message)
    } else {
      toast.success(isEdit ? 'Evento actualizado ✓' : 'Evento creado ✓')
      router.push('/admin/eventos')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <>
      {preview && <PreviewModal form={form} onClose={() => setPreview(false)} />}

      <form onSubmit={handleSubmit} style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>TÍTULO DEL EVENTO *</label>
          <input style={inputStyle} value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ej: Fiesta cumpleaños en El Poblado" required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>TIPO</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TipoEvento }))}>
              {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>FECHA *</label>
            <input type="date" style={inputStyle} value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} required />
          </div>
        </div>

        <div>
          <label style={labelStyle}>LUGAR</label>
          <input style={inputStyle} value={form.lugar} onChange={e => setForm(f => ({ ...f, lugar: e.target.value }))} placeholder="Ej: Salón Mediterráneo, Medellín" />
        </div>

        <div>
          <label style={labelStyle}>DESCRIPCIÓN</label>
          <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Descripción corta del evento..." />
        </div>

        {/* Cover image */}
        <div style={{ background: 'rgba(0,180,255,0.02)', border: '1px solid rgba(0,180,255,0.12)', borderRadius: 8, padding: 16 }}>
          <label style={labelStyle}>IMAGEN DE PORTADA</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {form.portada_url ? (
              <div style={{ position: 'relative' }}>
                <img src={form.portada_url} alt="Portada" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(0,180,255,0.2)' }} />
                <button type="button" onClick={() => setForm(f => ({ ...f, portada_url: '' }))}
                  style={{ position: 'absolute', top: -6, right: -6, background: '#ff5555', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <X size={11} />
                </button>
              </div>
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: 8, background: 'rgba(0,180,255,0.06)', border: '1px dashed rgba(0,180,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={22} color="rgba(0,180,255,0.3)" />
              </div>
            )}
            <div>
              <label style={{ cursor: 'pointer', fontSize: 13, color: '#00b4ff', fontWeight: 600, letterSpacing: 1, display: 'block', marginBottom: 4 }}>
                {coverUploading ? 'SUBIENDO...' : form.portada_url ? 'CAMBIAR PORTADA' : 'SUBIR PORTADA'}
                <input ref={coverRef} type="file" accept="image/*" onChange={uploadCover} style={{ display: 'none' }} disabled={coverUploading} />
              </label>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>JPG, PNG, WEBP · Recomendado 9:16</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input type="checkbox" id="publicado" checked={form.publicado} onChange={e => setForm(f => ({ ...f, publicado: e.target.checked }))} style={{ width: 16, height: 16, accentColor: '#00b4ff', cursor: 'pointer' }} />
          <label htmlFor="publicado" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>Publicar en el sitio web</label>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={loading}
            style={{ flex: 1, padding: '13px', borderRadius: 6, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Rajdhani, sans-serif' }}>
            {loading ? 'GUARDANDO...' : isEdit ? 'ACTUALIZAR' : 'CREAR EVENTO'}
          </button>
          <button type="button" onClick={() => setPreview(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 16px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(0,180,255,0.3)', color: '#00b4ff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif' }}>
            <Eye size={15} /> PREVIEW
          </button>
          <button type="button" onClick={() => router.back()}
            style={{ padding: '13px 20px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif' }}>
            CANCELAR
          </button>
        </div>
      </form>
    </>
  )
}
