'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Credenciales incorrectas')
    } else {
      toast.success('Bienvenido DJ Zulu 🎵')
      router.push('/admin')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#07071a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#0d0d2b', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 12, padding: '40px 36px', width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 4, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DJ ZULU
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginTop: 4 }}>PANEL DE ADMINISTRACIÓN</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>EMAIL</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 6, padding: '11px 14px', color: '#fff', fontSize: 15, outline: 'none' }}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, display: 'block', marginBottom: 6 }}>CONTRASEÑA</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 6, padding: '11px 14px', color: '#fff', fontSize: 15, outline: 'none' }}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading}
            style={{ marginTop: 8, padding: '13px', borderRadius: 6, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Rajdhani, sans-serif' }}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 24 }}>
          Crea tu usuario primero en Supabase → Authentication → Users
        </p>
      </div>
    </div>
  )
}
