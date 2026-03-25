import { createClient } from '@/lib/supabase/server'
import ConfigForm from '@/components/admin/ConfigForm'

export default async function ConfigPage() {
  const supabase = createClient()
  const { data } = await supabase.from('config').select('clave,valor')

  const config: Record<string, string> = {}
  data?.forEach(({ clave, valor }) => { if (valor) config[clave] = valor })

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Configuración
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
          Personaliza el contenido de tu sitio web
        </p>
      </div>
      <ConfigForm config={config} />
    </div>
  )
}
