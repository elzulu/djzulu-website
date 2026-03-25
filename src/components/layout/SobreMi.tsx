'use client'
import { motion } from 'framer-motion'
import { MapPin, Music2, Clock, Users } from 'lucide-react'

interface Props { config: Record<string, string> }

export default function SobreMi({ config }: Props) {
  const bio = config.bio
  if (!bio) return null

  const stats = [
    { icon: <Music2 size={18} />, value: config.eventos_count || '200+', label: 'Eventos' },
    { icon: <Clock size={18} />, value: (config.anos_experiencia || '4') + ' años', label: 'Experiencia' },
    { icon: <MapPin size={18} />, value: 'Oriente', label: 'Antioqueño' },
    { icon: <Users size={18} />, value: '5★', label: 'Valoración' },
  ]

  return (
    <section id="sobre-mi" style={{ padding: '80px 24px' }}>
      <div className="max-w-7xl mx-auto">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center' }}>

          {/* Photo */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {config.foto_perfil_url ? (
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,180,255,0.2)' }}>
                <img src={config.foto_perfil_url} alt={config.nombre_artistico || 'DJ Zulu'} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 520, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,26,0.6) 0%, transparent 50%)' }} />
              </div>
            ) : (
              <div style={{ borderRadius: 16, background: 'linear-gradient(135deg,rgba(0,180,255,0.08),rgba(180,79,255,0.08))', border: '1px solid rgba(0,180,255,0.15)', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 80, background: 'linear-gradient(135deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZULU</span>
              </div>
            )}

            {/* Mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 16 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.1)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ color: '#00b4ff', display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: '#00b4ff', marginBottom: 12, fontWeight: 600 }}>· SOBRE MÍ ·</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: 4, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 8 }}>
              {config.nombre_artistico || 'DJ ZULU'}
            </h2>
            {config.nombre_real && (
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, marginBottom: 24 }}>
                {config.nombre_real}
              </div>
            )}

            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 28, whiteSpace: 'pre-line' }}>
              {bio}
            </div>

            {config.ciudad && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
                <MapPin size={15} color="#00b4ff" />
                {config.ciudad}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Electrónica', 'Urbano', 'Crossover', 'Merengue', 'Open Format'].map(g => (
                <span key={g} style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.2)', fontSize: 13, color: '#00b4ff', fontWeight: 600 }}>{g}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
