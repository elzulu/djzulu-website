'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface PressKitProps {
  config: Record<string, string>
}

export default function PressKit({ config }: PressKitProps) {
  return (
    <section id="presskit" style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #07071a 0%, #0a0820 50%, #07071a 100%)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,8vw,80px)', letterSpacing: 6, background: 'linear-gradient(135deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 8 }}>
            · Información Empresarial ·
          </p>
        </motion.div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>

          {/* Left — Photo + brand */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,180,255,0.2)' }}>
              {config.presskit_foto_url ? (
                <Image src={config.presskit_foto_url} alt={config.nombre_artistico || 'DJ Zulu'} width={500} height={500}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: 400, background: 'linear-gradient(135deg,rgba(0,180,255,0.1),rgba(180,79,255,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 80, background: 'linear-gradient(135deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZULU</span>
                </div>
              )}
              {/* overlay badge */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 24px 24px', background: 'linear-gradient(to top, rgba(7,7,26,0.95), transparent)' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, letterSpacing: 4, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {config.nombre_artistico || 'DJ ZULU'}
                </div>
                <div style={{ fontSize: 11, letterSpacing: 4, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                  {config.tagline || 'Events & Media'}
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, marginTop: 16 }}>
              {[
                { num: config.eventos_count || '200+', label: 'Eventos realizados' },
                { num: '5★', label: 'Valoración clientes' },
                { num: (config.anos_experiencia || '4') + ' años', label: 'En el mercado' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(0,180,255,0.05)', border: '1px solid rgba(0,180,255,0.1)', borderRadius: i === 0 ? '8px 0 0 8px' : i === 2 ? '0 8px 8px 0' : 0, padding: '14px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.num}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — About + Company Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* About */}
            <div style={{ background: 'rgba(0,180,255,0.03)', border: '1px solid rgba(0,180,255,0.1)', borderRadius: 12, padding: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: '3px', color: '#00b4ff', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>
                Sobre la empresa
              </div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>
                {config.descripcion || 'Sets únicos para fiestas, eventos corporativos y shows en vivo. Tu evento merece el mejor sonido.'}
              </p>
            </div>

            {/* Company Info */}
            <div style={{ background: 'rgba(180,79,255,0.03)', border: '1px solid rgba(180,79,255,0.1)', borderRadius: 12, padding: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: '3px', color: '#b44fff', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>
                Datos de la empresa
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {config.nombre_artistico && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>Marca</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Zulu Events &amp; Media</span>
                  </div>
                )}
                {config.ciudad && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>Cobertura</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{config.ciudad}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>Tipo de servicio</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>DJ · Entretenimiento · Media · Eventos de Sonido</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>Tipo de eventos</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Corporativos · Sociales · Bodas · Festivales</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>Disponibilidad</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#25d366' }}>Disponible para contratación ✓</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
