'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'

const TIPOS = ['Fiesta privada', 'Corporativo', 'Boda', 'Quinceañera', 'Festival', 'Club', 'Otro']

export default function CotizacionForm({ whatsapp }: { whatsapp: string }) {
  const [form, setForm] = useState({ nombre: '', telefono: '', fecha: '', tipo: '', lugar: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = [
      `🎵 *COTIZACIÓN DJ ZULU*`,
      ``,
      `👤 *Nombre:* ${form.nombre}`,
      `📱 *Teléfono:* ${form.telefono}`,
      `📅 *Fecha del evento:* ${form.fecha}`,
      `🎉 *Tipo de evento:* ${form.tipo}`,
      `📍 *Lugar:* ${form.lugar}`,
      form.mensaje ? `💬 *Mensaje:* ${form.mensaje}` : '',
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 6000)
  }

  const inp = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,255,0.15)', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'Rajdhani, sans-serif' }
  const lbl = { fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, display: 'block' as const, marginBottom: 6 }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 14, padding: 32 }}>
      <div style={{ fontSize: 12, letterSpacing: 3, color: '#00b4ff', marginBottom: 10, fontWeight: 700 }}>COTIZA TU EVENTO</div>
      <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, letterSpacing: 2, marginBottom: 24 }}>Cuéntanos sobre tu evento</h3>

      {sent ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <CheckCircle size={52} color="#25d366" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: 18, fontWeight: 600 }}>¡Mensaje listo!</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Se abrió WhatsApp con tu cotización. Te respondemos muy pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div>
              <label style={lbl}>NOMBRE *</label>
              <input style={inp} required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Tu nombre completo" />
            </div>
            <div>
              <label style={lbl}>TELÉFONO *</label>
              <input style={inp} required value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} placeholder="3001234567" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div>
              <label style={lbl}>FECHA DEL EVENTO *</label>
              <input type="date" style={inp} required value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>TIPO DE EVENTO *</label>
              <select style={{ ...inp, cursor: 'pointer', color: '#fff', backgroundColor: '#0d0d2b' }} required value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option value="" style={{ background: '#0d0d2b', color: '#fff' }}>— Selecciona —</option>
                {TIPOS.map(t => <option key={t} value={t} style={{ background: '#0d0d2b', color: '#fff' }}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={lbl}>LUGAR / MUNICIPIO *</label>
            <input style={inp} required value={form.lugar} onChange={e => setForm(f => ({ ...f, lugar: e.target.value }))} placeholder="Ej: Salón Mediterráneo, Rionegro" />
          </div>

          <div>
            <label style={lbl}>MENSAJE ADICIONAL</label>
            <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))} placeholder="Número de invitados, horario, requerimientos especiales..." />
          </div>

          <button type="submit"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', borderRadius: 8, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', border: 'none', color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 15, fontWeight: 700, letterSpacing: 2, cursor: 'pointer' }}>
            <Send size={16} /> ENVIAR COTIZACIÓN
          </button>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
            Se abrirá WhatsApp con tu información lista para enviar
          </p>
        </form>
      )}
    </motion.div>
  )
}
