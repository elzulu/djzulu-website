'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { PlusCircle, Trash2, Pencil, Check, X, Plus } from 'lucide-react'
import type { Precio } from '@/types'

const EMPTY = { nombre: '', precio: '', periodo: '', destacado: false, features: [''], activo: true }

function parseFeatures(value: unknown): string[] {
  if (Array.isArray(value)) return value
  try { return JSON.parse(value as string) } catch { return [] }
}

export default function PreciosAdmin() {
  const supabase = createClient()
  const [precios, setPrecios] = useState<Precio[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<Precio | null>(null)
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('precios').select('*').order('orden')
    setPrecios((data ?? []) as Precio[])
  }

  function addFeature() { setForm(f => ({ ...f, features: [...f.features, ''] })) }
  function removeFeature(i: number) { setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) })) }
  function updateFeature(i: number, v: string) { setForm(f => { const arr = [...f.features]; arr[i] = v; return { ...f, features: arr } }) }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre || !form.precio) return toast.error('Nombre y precio son requeridos')
    setLoading(true)
    const payload = { ...form, features: form.features.filter(f => f.trim()) }
    if (editing) {
      const { error } = await supabase.from('precios').update(payload).eq('id', editing.id)
      if (error) toast.error('Error al actualizar')
      else { toast.success('Plan actualizado ✓'); setEditing(null) }
    } else {
      const { error } = await supabase.from('precios').insert({ ...payload, orden: precios.length })
      if (error) toast.error('Error al crear')
      else toast.success('Plan creado ✓')
    }
    setForm(EMPTY); load(); setLoading(false)
  }

  function startEdit(p: Precio) {
    setEditing(p)
    setForm({ nombre: p.nombre, precio: p.precio, periodo: p.periodo ?? '', destacado: p.destacado, features: parseFeatures(p.features), activo: p.activo })
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este plan?')) return
    await supabase.from('precios').delete().eq('id', id)
    toast.success('Eliminado ✓'); load()
  }

  const inp = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 6, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Rajdhani, sans-serif' }
  const lbl = { fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block' as const, marginBottom: 5 }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Planes & Precios</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{precios.length} planes</p>
      </div>

      <form onSubmit={save} style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 12, padding: 24, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)' }}>{editing ? 'EDITAR PLAN' : 'NUEVO PLAN'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div>
            <label style={lbl}>NOMBRE *</label>
            <input style={inp} required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Básico" />
          </div>
          <div>
            <label style={lbl}>PRECIO *</label>
            <input style={inp} required value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} placeholder="$300.000" />
          </div>
          <div>
            <label style={lbl}>PERÍODO</label>
            <input style={inp} value={form.periodo} onChange={e => setForm(f => ({ ...f, periodo: e.target.value }))} placeholder="hasta 6 horas · Medellín" />
          </div>
        </div>

        <div>
          <label style={lbl}>INCLUYE (características)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {form.features.map((feat, i) => (
              <div key={i} style={{ display: 'flex', gap: 6 }}>
                <input style={{ ...inp, flex: 1 }} value={feat} onChange={e => updateFeature(i, e.target.value)} placeholder={`Característica ${i + 1}`} />
                {form.features.length > 1 && (
                  <button type="button" onClick={() => removeFeature(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,85,85,0.5)', padding: '0 6px' }}><X size={14} /></button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addFeature} style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#00b4ff', fontSize: 12, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', padding: 0 }}>
            <Plus size={13} /> Agregar característica
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="destacado" checked={form.destacado} onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))} style={{ width: 16, height: 16, accentColor: '#00b4ff', cursor: 'pointer' }} />
          <label htmlFor="destacado" style={{ ...lbl, marginBottom: 0, cursor: 'pointer' }}>Marcar como "MÁS POPULAR"</label>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 6, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif' }}>
            {editing ? <><Check size={14} /> ACTUALIZAR</> : <><PlusCircle size={14} /> AGREGAR</>}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY) }} style={{ padding: '10px 16px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif' }}>CANCELAR</button>}
        </div>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {precios.map(p => (
          <div key={p.id} style={{ background: '#0d0d2b', border: `1px solid ${p.destacado ? 'rgba(0,180,255,0.3)' : 'rgba(0,180,255,0.1)'}`, borderRadius: 10, padding: 20 }}>
            {p.destacado && <div style={{ fontSize: 9, letterSpacing: 2, color: '#00b4ff', marginBottom: 8, fontWeight: 700 }}>★ MÁS POPULAR</div>}
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.precio}</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{p.nombre}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>{p.periodo}</div>
            <ul style={{ listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {parseFeatures(p.features).map((f: string) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#00b4ff' }}>·</span> {f}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => startEdit(p)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', borderRadius: 5, border: '1px solid rgba(0,180,255,0.25)', background: 'transparent', color: '#00b4ff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                <Pencil size={12} /> Editar
              </button>
              <button onClick={() => remove(p.id)} style={{ padding: '7px 10px', borderRadius: 5, border: 'none', background: 'rgba(255,85,85,0.08)', cursor: 'pointer', color: 'rgba(255,85,85,0.6)' }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
