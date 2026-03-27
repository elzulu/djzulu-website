'use client'
import { motion } from 'framer-motion'
import { MessageCircle, Music2, Video, MapPin, Instagram, Youtube } from 'lucide-react'

interface Props {
  config: Record<string, string>
}

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
  </svg>
)

const SERVICIOS_BOOKING = [
  { icon: <Music2 size={20} />, label: 'Fiestas & Eventos Privados' },
  { icon: <Video size={20} />, label: 'Eventos Corporativos' },
  { icon: <Music2 size={20} />, label: 'Shows & Festivales' },
  { icon: <Video size={20} />, label: 'Cobertura Audiovisual' },
]

export default function Contacto({ config }: Props) {
  const whatsapp = config.whatsapp?.replace(/\D/g, '') || ''
  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola DJ Zulu, me interesa hacer una reserva 🎵')}`
  const waBookingUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola DJ Zulu, quiero hacer un booking para un evento. Por favor envíame información sobre disponibilidad y tarifas 🎶')}`

  return (
    <div>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#00b4ff', marginBottom: 12, fontWeight: 600 }}>
            · RESERVAS & CONTRATACIONES ·
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: 4, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
            CONTACTO & BOOKING
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
            ¿Tienes un evento? Hablemos y hagamos algo increíble juntos.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

          {/* Booking card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 14, padding: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top left, rgba(0,180,255,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

            <div style={{ fontSize: 12, letterSpacing: 3, color: '#00b4ff', marginBottom: 16, fontWeight: 700 }}>BOOKING</div>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, marginBottom: 8 }}>Reserva tu fecha</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 24 }}>
              Disponible para fiestas privadas, eventos corporativos, bodas, quinceañeras y festivales en Medellín y toda Colombia.
            </p>

            <ul style={{ listStyle: 'none', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SERVICIOS_BOOKING.map(s => (
                <li key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#00b4ff', flexShrink: 0 }}>{s.icon}</span>
                  {s.label}
                </li>
              ))}
            </ul>

            <a href={waBookingUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '14px', borderRadius: 8, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 15, fontWeight: 700, letterSpacing: 2, textDecoration: 'none', transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <MessageCircle size={18} />
              HACER BOOKING
            </a>
          </motion.div>

          {/* Contact info card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ background: '#0d0d2b', border: '1px solid rgba(180,79,255,0.2)', borderRadius: 14, padding: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right, rgba(180,79,255,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

            <div style={{ fontSize: 12, letterSpacing: 3, color: '#b44fff', marginBottom: 16, fontWeight: 700 }}>CONTACTO DIRECTO</div>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2, marginBottom: 24 }}>Escríbenos ahora</h3>

            {/* WhatsApp */}
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 10, textDecoration: 'none', marginBottom: 12, transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(37,211,102,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(37,211,102,0.2)')}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageCircle size={20} color="#25d366" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 2 }}>WHATSAPP</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>+{whatsapp}</div>
              </div>
            </a>

            {/* Redes sociales */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {config.youtube_url && (
                <a href={config.youtube_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.15)', borderRadius: 10, textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,0,0,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,0,0,0.15)')}>
                  <Youtube size={22} color="#ff0000" />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>YouTube — @elzulu_oficial</span>
                </a>
              )}
              {config.tiktok_url && (
                <a href={config.tiktok_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
                  <TikTokIcon />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>TikTok — @zulu.events.media</span>
                </a>
              )}
              {config.instagram_url && (
                <a href={config.instagram_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'rgba(225,48,108,0.06)', border: '1px solid rgba(225,48,108,0.15)', borderRadius: 10, textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(225,48,108,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(225,48,108,0.15)')}>
                  <Instagram size={22} color="#e1306c" />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Instagram — @elzulu_oficial</span>
                </a>
              )}
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
              <MapPin size={16} color="rgba(255,255,255,0.3)" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{config.ciudad || 'Medellín, Colombia'}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
