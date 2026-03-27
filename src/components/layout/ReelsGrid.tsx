'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Evento } from '@/types'
import { tipoLabel, formatFecha } from '@/lib/utils'
import { X, Play } from 'lucide-react'

interface ReelsGridProps {
  eventos: Evento[]
}

function Slideshow({ images }: { images: { id: string; url: string }[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length])

  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#111', minHeight: 300 }}>
      <AnimatePresence>
        <motion.div key={images[idx].id}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, position: 'absolute' }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%' }}>
          <img src={images[idx].url} alt="" style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', display: 'block' }} />
        </motion.div>
      </AnimatePresence>
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 3, background: i === idx ? '#00b4ff' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ReelsGrid({ eventos }: ReelsGridProps) {
  const [selected, setSelected] = useState<Evento | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  // Mover foco al abrir/cerrar el modal
  useEffect(() => {
    if (selected) {
      const t = setTimeout(() => closeButtonRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      triggerRef.current?.focus()
    }
  }, [selected])

  // Focus trap dentro del modal
  useEffect(() => {
    if (!selected) return
    const modal = modalRef.current
    if (!modal) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selected])

  function openModal(evento: Evento, trigger: HTMLElement) {
    triggerRef.current = trigger
    setSelected(evento)
  }

  function closeModal() { setSelected(null) }

  if (eventos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
        Próximamente — los primeros eventos aparecerán aquí.
      </div>
    )
  }

  return (
    <>
      <div className="reels-grid">
        {eventos.map((evento, i) => {
          const coverUrl = evento.portada_url || (evento.media?.find(m => m.tipo === 'imagen')?.url)
          const hasVideo = evento.media?.some(m => m.tipo === 'video')

          return (
          <motion.div key={evento.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            role="button"
            tabIndex={0}
            aria-label={`Ver evento: ${evento.titulo}`}
            onClick={e => openModal(evento, e.currentTarget as HTMLElement)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(evento, e.currentTarget as HTMLElement) } }}
            style={{ position: 'relative', aspectRatio: '9/16', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(0,180,255,0.15)', background: '#0d0d2b' }}>
            {/* Thumbnail */}
            {coverUrl ? (
              <Image src={coverUrl} alt={evento.titulo} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
            ) : (
              <ReelPlaceholder index={i} />
            )}
            {/* Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(7,7,26,0.88) 0%,rgba(7,7,26,0.1) 50%,transparent 100%)' }} />
            {/* Play button — solo si tiene video */}
            {hasVideo && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 48, height: 48, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={18} fill="white" color="white" style={{ marginLeft: 3 }} />
              </div>
            )}
            {/* Badge nuevo (primeros 2) */}
            {i < 2 && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', fontSize: 9, letterSpacing: 2, color: '#fff', padding: '3px 9px', borderRadius: 3, fontWeight: 700 }}>
                NUEVO
              </div>
            )}
            {/* Info */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: '#00b4ff', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>
                {tipoLabel(evento.tipo)}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{evento.titulo}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{formatFecha(evento.fecha)}</div>
            </div>
          </motion.div>
        )})}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={selected.titulo}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              ref={modalRef}
              onClick={e => e.stopPropagation()}
              style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 12, maxWidth: 1000, width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: 36 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#00b4ff', marginBottom: 6, fontWeight: 600 }}>{tipoLabel(selected.tipo)}</div>
                  <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 2 }}>{selected.titulo}</h2>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{selected.lugar} · {formatFecha(selected.fecha)}</p>
                </div>
                <button ref={closeButtonRef} onClick={closeModal} aria-label="Cerrar modal" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>
              {selected.descripcion && (
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 20 }}>{selected.descripcion}</p>
              )}
              {/* Media */}
              {selected.media && selected.media.length > 0 && (() => {
                const videos = selected.media.filter(m => m.tipo === 'video')
                const images = selected.media.filter(m => m.tipo === 'imagen')
                const onlyImages = videos.length === 0 && images.length > 0

                return onlyImages ? (
                  <Slideshow images={images} />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                    {selected.media.map(m => (
                      <div key={m.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: m.tipo === 'video' ? '16/9' : '1/1', background: '#111' }}>
                        {m.tipo === 'video' ? (
                          <video src={m.url} controls preload="none" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Image src={m.url} alt="" fill style={{ objectFit: 'cover' }} sizes="350px" />
                        )}
                      </div>
                    ))}
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ReelPlaceholder({ index }: { index: number }) {
  const colors = [
    'radial-gradient(ellipse at center,#1a0550 0%,#07071a 100%)',
    'radial-gradient(ellipse at center,#001535 0%,#07071a 100%)',
    'radial-gradient(ellipse at center,#1a0535 0%,#07071a 100%)',
  ]
  return (
    <div style={{ width: '100%', height: '100%', background: colors[index % 3], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="60" height="60" viewBox="0 0 60 60" opacity={0.2}>
        <circle cx="30" cy="30" r="26" stroke="#00b4ff" strokeWidth="1" fill="none"/>
        <circle cx="30" cy="30" r="12" stroke="#b44fff" strokeWidth="1" fill="none"/>
        <circle cx="30" cy="30" r="4" fill="#00b4ff"/>
      </svg>
    </div>
  )
}
