'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { SectionHeader } from './Servicios'
import type { Testimonio } from '@/types'

export default function Testimonios({ testimonios }: { testimonios: Testimonio[] }) {
  if (testimonios.length === 0) return null

  return (
    <section id="testimonios" style={{ padding: '0 24px 80px' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionHeader title="Testimonios" count={`${testimonios.length} reseñas`} />
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {testimonios.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.12)', borderRadius: 12, padding: 24, position: 'relative', overflow: 'hidden' }}>
              {/* Quote mark */}
              <div style={{ position: 'absolute', top: 16, right: 20, fontFamily: 'Georgia, serif', fontSize: 72, color: 'rgba(0,180,255,0.06)', lineHeight: 1, userSelect: 'none' }}>&ldquo;</div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} fill="#00b4ff" color="#00b4ff" />
                ))}
              </div>

              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 20 }}>
                &ldquo;{t.texto}&rdquo;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {t.foto_url ? (
                  <img src={t.foto_url} alt={t.nombre} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,180,255,0.3)' }} />
                ) : (
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,180,255,0.3),rgba(180,79,255,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', border: '2px solid rgba(0,180,255,0.2)' }}>
                    {t.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{t.nombre}</div>
                  {t.evento && <div style={{ fontSize: 12, color: '#00b4ff', letterSpacing: 0.5 }}>{t.evento}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
