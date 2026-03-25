'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { PlusCircle, Trash2, Pencil, Check, X } from 'lucide-react'
import type { Servicio } from '@/types'

const ICONOS = ['music', 'briefcase', 'zap', 'star', 'camera', 'users', 'mic', 'headphones']
const EMPTY = { nombre: '', descripcion: '', icono: 'music', activo: true }

export default function ServiciosAdmin() {
  const supabase = createClient()
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<Servicio | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('servicios').select('*').order('orden')
    setServicios((data ?? []) as Servicio[])
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre) return toast.error('El nombre es requerido')
    setLoading(true)
    if (editing) {
      const { error } = await supabase.from('servicios').update(form).eq('id', editing.id)
      if (error) toast.error('Error al actualizar')
      else { toast.success('Servicio actualizado ✓'); setEditing(null) }
    } else {
      const { error } = await supabase.from('servicios').insert({ ...form, orden: servicios.length })
      if (error) toast.error('Error al crear')
      else toast.success('Servicio creado ✓')
    }
    setForm(EMPTY)
    load()
    setLoading(false)
  }

  async function toggle(s: Servicio) {
    await supabase.from('servicios').update({ activo: !s.activo }).eq('id', s.id)
    load()
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este servicio?')) return
    await supabase.from('servicios').delete().eq('id', id)
    toast.success('Eliminado ✓'); load()
  }

  function startEdit(s: Servicio) {
    setEditing(s)
    setForm({ nombre: s.nombre, descripcion: s.descripcion ?? '', icono: s.icono, activo: s.activo })
  }

  const inp = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 6, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Rajdhani, sans-serif' }
  const lbl = { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block' as const, marginBottom: 5 }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Servicios</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{servicios.length} servicios</p>
      </div>

      <form onSubmit={save} style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 12, padding: 24, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)' }}>{editing ? 'EDITAR SERVICIO' : 'NUEVO SERVICIO'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lbl}>NOMBRE *</label>
            <input style={inp} required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Fiestas Privadas" />
          </div>
          <div>
            <label style={lbl}>ÍCONO</label>
            <select style={{ ...inp, cursor: 'pointer' }} value={form.icono} onChange={e => setForm(f => ({ ...f, icono: e.target.value }))}>
              {ICONOS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={lbl}>DESCRIPCIÓN</label>
          <textarea style={{ ...inp, minHeight: 70, resize: 'vertical' }} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Describe el servicio..." />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 6, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif' }}>
            {editing ? <><Check size={14} /> ACTUALIZAR</> : <><PlusCircle size={14} /> AGREGAR</>}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY) }} style={{ padding: '10px 16px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif' }}>CANCELAR</button>}
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {servicios.map(s => (
          <div key={s.id} style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.1)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, opacity: s.activo ? 1 : 0.5 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{s.nombre}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{s.icono} · {s.descripcion?.slice(0, 60)}{(s.descripcion?.length ?? 0) > 60 ? '...' : ''}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggle(s)} style={{ padding: '5px 10px', borderRadius: 5, border: `1px solid ${s.activo ? 'rgba(0,180,255,0.3)' : 'rgba(255,255,255,0.15)'}`, background: 'transparent', color: s.activo ? '#00b4ff' : 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                {s.activo ? 'ACTIVO' : 'OCULTO'}
              </button>
              <button onClick={() => startEdit(s)} style={{ background: 'none', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 5, padding: '5px 8px', cursor: 'pointer', color: '#00b4ff' }}><Pencil size={13} /></button>
              <button onClick={() => remove(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,85,85,0.5)', padding: 5 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ff5555')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,85,85,0.5)')}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
