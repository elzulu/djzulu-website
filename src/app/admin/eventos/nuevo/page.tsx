import EventoForm from '@/components/admin/EventoForm'

export default function NuevoEventoPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Nuevo Evento
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
          Completa los datos del evento. Luego podrás subir fotos y videos desde Galería.
        </p>
      </div>
      <EventoForm />
    </div>
  )
}
