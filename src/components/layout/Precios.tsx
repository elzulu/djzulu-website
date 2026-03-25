'use client'
import { motion } from 'framer-motion'
import type { Precio } from '@/types'
import { Check } from 'lucide-react'

export default function Precios({ precios, whatsapp }: { precios: Precio[]; whatsapp: string }) {
  const waUrl = (plan: string) =>
    `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola DJ Zulu, me interesa el plan ${plan} 🎵`)}`

  return (
    <section id="precios" style={{ padding: '0 24px 80px' }}>
      <div className="max-w-7xl mx-auto">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <h2 className="section-title">Precios</h2>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(0,180,255,0.15),transparent)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {precios.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
              style={{
                background: '#0d0d2b',
                border: p.destacado ? '1px solid #00b4ff' : '1px solid rgba(0,180,255,0.15)',
                borderRadius: 10,
                padding: 26,
                position: 'relative',
                overflow: 'hidden',
              }}>
              {p.destacado && (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top,rgba(0,180,255,0.06) 0%,transparent 60%)', pointerEvents: 'none' }} />
                  <div style={{ display: 'inline-block', background: 'linear-gradient(90deg,#00b4ff,#b44fff)', fontSize: 9, letterSpacing: 2, color: '#fff', padding: '4px 10px', borderRadius: 3, marginBottom: 14, fontWeight: 700 }}>
                    MÁS POPULAR
                  </div>
                </>
              )}
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 8, fontWeight: 500 }}>{p.nombre}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: p.precio === 'A convenir' ? 28 : 46, letterSpacing: 1, lineHeight: 1, marginBottom: 4 }}>
                {p.precio}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 22, letterSpacing: 0.5 }}>{p.periodo}</div>
              <ul style={{ listStyle: 'none', marginBottom: 22 }}>
                {(Array.isArray(p.features) ? p.features : JSON.parse(p.features as unknown as string)).map((f: string) => (
                  <li key={f} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={14} color="#00b4ff" style={{ flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={waUrl(p.nombre)} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'block', width: '100%', padding: 12, borderRadius: 5,
                  fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '1.5px',
                  cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
                  background: p.destacado ? 'linear-gradient(90deg,#00b4ff,#b44fff)' : 'transparent',
                  border: p.destacado ? 'none' : '1px solid rgba(0,180,255,0.3)',
                  color: p.destacado ? '#fff' : '#00b4ff',
                }}>
                {p.precio === 'A convenir' ? 'HABLAR POR WHATSAPP' : 'COTIZAR AHORA'}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
