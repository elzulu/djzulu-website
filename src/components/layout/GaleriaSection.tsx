'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Media } from '@/types'
import { SectionHeader } from './Servicios'

interface Props { media: Media[] }

export default function GaleriaSection({ media }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (media.length === 0) return null

  const prev = () => setLightbox(i => (i! - 1 + media.length) % media.length)
  const next = () => setLightbox(i => (i! + 1) % media.length)

  return (
    <section id="galeria" style={{ padding: '0 24px 80px' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionHeader title="Galería" count={`${media.length} fotos`} />
        </motion.div>

        <div className="gallery-grid">
          {media.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.05 }}
              whileHover={{ scale: 1.03, zIndex: 1 }}
              onClick={() => setLightbox(i)}
              style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.08)' }}>
              <img src={item.url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,180,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Close */}
            <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>

            {/* Prev */}
            {media.length > 1 && (
              <button onClick={e => { e.stopPropagation(); prev() }} style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={22} />
              </button>
            )}

            <motion.img key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              src={media[lightbox].url} alt=""
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} />

            {/* Next */}
            {media.length > 1 && (
              <button onClick={e => { e.stopPropagation(); next() }} style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={22} />
              </button>
            )}

            {/* Counter */}
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>
              {lightbox + 1} / {media.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
