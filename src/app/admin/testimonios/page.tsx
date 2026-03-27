'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { PlusCircle, Trash2, Save } from 'lucide-react'
import type { Testimonio } from '@/components/layout/Testimonios'

const EMPTY = { nombre: '', evento: '', texto: '', foto_url: '' }

export default function TestimoniosAdmin() {
  const supabase = createClient()
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [])

  async function load() {
    setFetching(true)
    const { data } = await supabase.from('testimonios').select('*').order('orden')
    setTestimonios((data ?? []) as Testimonio[])
    setFetching(false)
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre || !form.texto) return toast.error('Nombre y texto son requeridos')
    setLoading(true)
    const { error } = await supabase.from('testimonios').insert({ ...form, orden: testimonios.length, activo: true })
    if (error) toast.error('Error al guardar')
    else { toast.success('Testimonio agregado ✓'); setForm(EMPTY); load() }
    setLoading(false)
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este testimonio?')) return
    await supabase.from('testimonios').delete().eq('id', id)
    toast.success('Eliminado ✓')
    load()
  }

  const inp = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 6, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Rajdhani, sans-serif' }
  const lbl = { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block' as const, marginBottom: 5 }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Testimonios</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{testimonios.length} reseñas publicadas</p>
      </div>

      {/* Form */}
      <form onSubmit={add} style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 12, padding: 24, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>NUEVO TESTIMONIO</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={lbl}>NOMBRE *</label>
            <input style={inp} required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre del cliente" />
          </div>
          <div>
            <label style={lbl}>EVENTO</label>
            <input style={inp} value={form.evento} onChange={e => setForm(f => ({ ...f, evento: e.target.value }))} placeholder="Ej: Boda Villa María" />
          </div>
        </div>
        <div>
          <label style={lbl}>RESEÑA *</label>
          <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} required value={form.texto} onChange={e => setForm(f => ({ ...f, texto: e.target.value }))} placeholder="El cliente escribió..." />
        </div>
        <div>
          <label style={lbl}>FOTO URL (opcional)</label>
          <input style={inp} value={form.foto_url} onChange={e => setForm(f => ({ ...f, foto_url: e.target.value }))} placeholder="https://..." />
        </div>
        <button type="submit" disabled={loading}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 6, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', width: 'fit-content' }}>
          <PlusCircle size={15} /> {loading ? 'GUARDANDO...' : 'AGREGAR TESTIMONIO'}
        </button>
      </form>

      {/* List */}
      {fetching ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Cargando...</p>
      ) : testimonios.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>No hay testimonios aún. Agrega el primero ☝️</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {testimonios.map(t => (
            <div key={t.id} style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.1)', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{t.nombre}</div>
                {t.evento && <div style={{ fontSize: 12, color: '#00b4ff', marginBottom: 6 }}>{t.evento}</div>}
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>&ldquo;{t.texto}&rdquo;</div>
              </div>
              <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,85,85,0.5)', padding: 4, flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ff5555')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,85,85,0.5)')}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
