import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/layout/Hero'
import ReelsGrid from '@/components/layout/ReelsGrid'
import Servicios, { SectionHeader } from '@/components/layout/Servicios'
import Precios from '@/components/layout/Precios'
import PressKit from '@/components/layout/PressKit'
import GaleriaSection from '@/components/layout/GaleriaSection'
import Contacto from '@/components/layout/Contacto'
import CotizacionForm from '@/components/layout/CotizacionForm'
import Testimonios from '@/components/layout/Testimonios'
import SobreMi from '@/components/layout/SobreMi'
import Footer from '@/components/layout/Footer'
import type { Config, Evento, Servicio, Precio, Media, Testimonio } from '@/types'

export const revalidate = 60

const EMPTY_DATA = {
  config: {} as Config,
  eventos: [] as Evento[],
  servicios: [] as Servicio[],
  precios: [] as Precio[],
  galeriaMedia: [] as Media[],
  testimonios: [] as Testimonio[],
}

async function getData() {
  try {
    const supabase = createClient()

    const [configRes, eventosRes, serviciosRes, preciosRes, mediaRes, testimoniosRes] = await Promise.all([
      supabase.from('config').select('clave,valor'),
      supabase.from('eventos').select('*, media(*)').eq('publicado', true).order('orden', { ascending: true }).order('fecha', { ascending: false }).limit(6),
      supabase.from('servicios').select('*').eq('activo', true).order('orden'),
      supabase.from('precios').select('*').eq('activo', true).order('orden'),
      supabase.from('media').select('*').eq('tipo', 'imagen').order('created_at', { ascending: false }).limit(32),
      supabase.from('testimonios').select('*').eq('activo', true).order('orden').limit(6),
    ])

    const config: Config = {}
    configRes.data?.forEach(({ clave, valor }) => { if (valor) config[clave] = valor })

    return {
      config,
      eventos: (eventosRes.data ?? []) as Evento[],
      servicios: (serviciosRes.data ?? []) as Servicio[],
      precios: (preciosRes.data ?? []) as Precio[],
      galeriaMedia: (mediaRes.data ?? []) as Media[],
      testimonios: (testimoniosRes.data ?? []) as Testimonio[],
    }
  } catch {
    return EMPTY_DATA
  }
}

export default async function HomePage() {
  const { config, eventos, servicios, precios, galeriaMedia, testimonios } = await getData()

  return (
    <>
      <Navbar whatsapp={config.whatsapp ?? ''} logoUrl={config.logo_url} />
      <main>
        <Hero config={config} />

        {/* Eventos */}
        <section id="eventos" style={{ padding: '80px 24px 60px' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Mis Eventos" count={`${eventos.length} eventos`} />
            <ReelsGrid eventos={eventos} />
          </div>
        </section>

        <GaleriaSection media={galeriaMedia} />
        <Servicios servicios={servicios} />
        <Testimonios testimonios={testimonios} />

        {/* Contacto con formulario */}
        <section id="contacto" style={{ padding: '80px 24px' }}>
          <div className="max-w-7xl mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            <CotizacionForm whatsapp={config.whatsapp ?? ''} />
            <Contacto config={config} />
          </div>
        </section>

        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.3), rgba(180,79,255,0.3), transparent)' }} />
        </div>
        <PressKit config={config} />
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.3), rgba(180,79,255,0.3), transparent)' }} />
        </div>
        <SobreMi config={config} />
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.3), rgba(180,79,255,0.3), transparent)' }} />
        </div>
        <Precios precios={precios} whatsapp={config.whatsapp ?? ''} />
      </main>
      <Footer config={config} />
    </>
  )
}
