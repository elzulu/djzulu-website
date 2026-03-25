'use client'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import Image from 'next/image'
import { useMemo, useEffect, useRef } from 'react'

function CountUp({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const num = parseInt(value.replace(/\D/g, ''), 10)
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, v => Math.round(v))

  useEffect(() => {
    if (!inView || isNaN(num)) return
    const ctrl = animate(mv, num, { duration: 1.8, ease: 'easeOut' })
    return ctrl.stop
  }, [inView, num, mv])

  if (isNaN(num)) return <span>{value}</span>
  return (
    <div ref={ref} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 1 }}>
      <motion.span>{rounded}</motion.span>
      <span>{value.replace(/[0-9]/g, '')}{suffix}</span>
    </div>
  )
}

interface HeroProps {
  config: Record<string, string>
}

const ICONS = ['🎛️', '🎧', '💿', '🎚️', '🎵', '🎶', '🎤']
const HERO_IMG = 'https://eysuzbimipheuuaizaxz.supabase.co/storage/v1/object/public/media/Screenshot_2026-03-24-18-25-00-370_com.google.android.apps.photos.png'

const TICKER_TEXT = '· DJ ZULU · EVENTS & MEDIA · MEDELLÍN · ZULU EVENTS · DJ · BOOKING · '

function FallingItems() {
  const items = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    icon: ICONS[i % ICONS.length],
    left: `${(i * 4.3 + Math.sin(i * 1.7) * 8 + 50) % 100}%`,
    duration: 6 + (i % 7) * 1.2,
    delay: -(i * 0.9),
    size: 18 + (i % 4) * 8,
    rotate: (i % 2 === 0 ? 1 : -1) * (180 + i * 30),
  })), [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {items.map(item => (
        <motion.div key={item.id}
          style={{ position: 'absolute', top: '-60px', left: item.left, fontSize: item.size, opacity: 0.18, userSelect: 'none' }}
          animate={{ y: '110vh', rotate: item.rotate, opacity: [0, 0.22, 0.22, 0] }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.85, 1] }}>
          {item.icon}
        </motion.div>
      ))}
    </div>
  )
}

const PANELS = [
  { tint: 'rgba(0,180,255,0.45)', skew: '-8deg' },
  { tint: 'rgba(180,79,255,0.35)', skew: '-8deg' },
  { tint: 'rgba(0,180,255,0.2)',   skew: '-8deg' },
  { tint: 'rgba(180,79,255,0.45)', skew: '-8deg' },
  { tint: 'rgba(0,100,200,0.4)',   skew: '-8deg' },
]

export default function Hero({ config }: HeroProps) {
  const wa = config.whatsapp || '573001234567'
  const waUrl = `https://wa.me/${wa.replace(/\D/g, '')}?text=${encodeURIComponent('Hola DJ Zulu, me interesa cotizar un evento 🎵')}`
  const bars = [0.8, 0.6, 1.0, 0.7, 0.9, 0.5, 0.75]
  const ticker = Array(6).fill(TICKER_TEXT).join('')

  return (
    <section id="inicio" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#07071a' }}>

      {/* Ticker top */}
      <div style={{ position: 'relative', zIndex: 20, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: 64 }}>
        <div style={{ display: 'inline-block', animation: 'ticker 35s linear infinite', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: 4, color: '#fff' }}>{ticker}{ticker}</span>
        </div>
      </div>

      {/* Background photo */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${HERO_IMG}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,180,255,0.3) 0%, rgba(180,79,255,0.25) 50%, rgba(0,100,200,0.3) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,7,26,0.65)' }} />
      </div>

      <FallingItems />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 100px)', padding: '40px 24px 60px', textAlign: 'center' }}>

        {/* Logo circle */}
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', width: 160, height: 160, marginBottom: 24 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(0,180,255,0.5)', boxShadow: '0 0 40px rgba(0,180,255,0.4), 0 0 20px rgba(180,79,255,0.3)' }}>
            {config.logo_url && (
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${config.logo_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            )}
            {[45, 65].map(r => (
              <div key={r} style={{ position: 'absolute', top: '50%', left: '50%', width: r * 2, height: r * 2, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: '1px solid rgba(0,180,255,0.2)', pointerEvents: 'none' }} />
        </motion.div>

        {/* Main title */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          style={{ background: 'rgba(7,7,26,0.55)', backdropFilter: 'blur(6px)', borderRadius: 20, padding: '32px 48px', border: '1px solid rgba(0,180,255,0.1)' }}>
          <p style={{ fontSize: 11, letterSpacing: '6px', color: '#00b4ff', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700, textShadow: '0 0 12px rgba(0,180,255,0.8)' }}>
            · DJ · Events & Media · Medellín ·
          </p>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 'clamp(72px, 14vw, 140px)', lineHeight: 0.9, letterSpacing: 2, marginBottom: 12, background: 'linear-gradient(135deg,#00b4ff 0%,#ffffff 50%,#b44fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(0,180,255,0.6))' }}>
            {config.nombre_artistico?.replace('DJ ', '') || 'ZULU'}
          </h1>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 10, color: 'rgba(255,255,255,0.85)', marginBottom: 24, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
            {config.tagline || 'EVENTS & MEDIA'}
          </p>

          {/* Equalizer bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 40, justifyContent: 'center', marginBottom: 28 }}>
            {bars.map((speed, i) => (
              <div key={i} style={{ width: 7, background: 'linear-gradient(to top,#00b4ff,#b44fff)', borderRadius: 3, animation: `${i % 2 === 0 ? 'eq1' : 'eq2'} ${speed}s ease-in-out infinite alternate` }} />
            ))}
          </div>

          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
            {config.descripcion}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 6, background: 'linear-gradient(90deg,#128c7e,#25d366)', color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '1px', textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.117 1.535 5.847L.057 23.492a.5.5 0 0 0 .613.613l5.65-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              Cotizar ahora
            </a>
            <a href="#eventos"
              style={{ display: 'flex', alignItems: 'center', padding: '14px 32px', borderRadius: 6, border: '1px solid rgba(0,180,255,0.4)', color: '#00b4ff', fontSize: 15, fontWeight: 700, letterSpacing: '1px', textDecoration: 'none' }}>
              Ver eventos ↓
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', paddingTop: 28, borderTop: '1px solid rgba(0,180,255,0.12)' }}>
            {[
              { num: config.eventos_count || '200+', label: 'Eventos' },
              { num: '5★', label: 'Valoración' },
              { num: (config.anos_experiencia || '4') + ' años', label: 'Experiencia' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 46, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}><CountUp value={s.num} /></div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ticker bottom */}
      <div style={{ position: 'relative', zIndex: 20, background: 'linear-gradient(90deg,#b44fff,#00b4ff)', padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', animation: 'ticker 35s linear infinite reverse', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: 4, color: '#fff' }}>{ticker}{ticker}</span>
        </div>
      </div>

    </section>
  )
}
