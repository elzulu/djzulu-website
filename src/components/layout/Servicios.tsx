'use client'
import { motion } from 'framer-motion'
import type { Servicio } from '@/types'
import { Music, Briefcase, Zap, Star, Camera, Users } from 'lucide-react'

const ICON_MAP: Record<string, React.ReactNode> = {
  music: <Music size={20} color="#00b4ff" />,
  briefcase: <Briefcase size={20} color="#00b4ff" />,
  zap: <Zap size={20} color="#00b4ff" />,
  star: <Star size={20} color="#00b4ff" />,
  camera: <Camera size={20} color="#00b4ff" />,
  users: <Users size={20} color="#00b4ff" />,
}

export default function Servicios({ servicios }: { servicios: Servicio[] }) {
  return (
    <section id="servicios" style={{ padding: '80px 24px' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Servicios" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {servicios.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: [0, -10, 4, -6, 2, 0], transition: { duration: 0.5 } }}
              className="card" style={{ padding: 26 }}>
              <motion.div
                whileHover={{ scale: [1, 1.4, 0.85, 1.15, 1], transition: { duration: 0.5 } }}
                style={{ width: 42, height: 42, borderRadius: 8, background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, cursor: 'default' }}>
                {ICON_MAP[s.icono] || <Music size={20} color="#00b4ff" />}
              </motion.div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>{s.nombre}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{s.descripcion}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SectionHeader({ title, count }: { title: string; count?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
      <h2 className="section-title">{title}</h2>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(0,180,255,0.15),transparent)' }} />
      {count && <span style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.25)' }}>{count}</span>}
    </div>
  )
}
