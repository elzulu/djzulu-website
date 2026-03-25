interface FooterProps {
  config: Record<string, string>
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer style={{ padding: '24px 36px', borderTop: '1px solid rgba(0,180,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 4, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ZULU EVENTS & MEDIA
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: 0.5, textAlign: 'center' }}>
        © {new Date().getFullYear()} · {config.ciudad || 'Medellín, Colombia'}
        <span style={{ display: 'block', marginTop: 2, color: 'rgba(255,255,255,0.12)' }}>
          Developed by <span style={{ color: 'rgba(0,180,255,0.4)' }}>JorZunex Solutions</span>
        </span>
      </div>
    </footer>
  )
}
