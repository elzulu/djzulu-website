'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Eventos', href: '#eventos' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Precios', href: '#precios' },
  { label: 'Press Kit', href: '#presskit' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar({ whatsapp, logoUrl }: { whatsapp: string; logoUrl?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const waUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola DJ Zulu, me interesa cotizar un evento 🎵')}`

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(7,7,26,0.97)' : 'rgba(7,7,26,0.7)',
        borderBottom: '1px solid rgba(0,180,255,0.12)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <Image src={logoUrl} alt="DJ Zulu" width={40} height={40} className="rounded-full object-cover" style={{ border: '1.5px solid #00b4ff' }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #00b4ff', background: 'rgba(0,180,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="url(#navGrad)">
                <defs><linearGradient id="navGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#00b4ff"/><stop offset="100%" stopColor="#b44fff"/></linearGradient></defs>
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          )}
          <span className="font-bebas text-xl tracking-widest gradient-text" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            DJ ZULU
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium tracking-wider transition-colors" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00b4ff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              {l.label}
            </a>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wider text-white px-4 py-2 rounded-md transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(90deg,#128c7e,#25d366)', letterSpacing: '1px' }}>
          <WaIcon />
          WhatsApp
        </a>

        {/* Mobile menu btn */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4" style={{ background: 'rgba(7,7,26,0.98)' }}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-sm font-medium tracking-wider py-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {l.label}
            </a>
          ))}
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2 rounded-md w-fit"
            style={{ background: 'linear-gradient(90deg,#128c7e,#25d366)' }}>
            <WaIcon /> WhatsApp
          </a>
        </div>
      )}
    </nav>
  )
}

function WaIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.117 1.535 5.847L.057 23.492a.5.5 0 0 0 .613.613l5.65-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  )
}
