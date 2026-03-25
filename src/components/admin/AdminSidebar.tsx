'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, CalendarDays, ImageIcon, Settings, LogOut, Music, DollarSign, Wrench, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/admin/galeria', label: 'Galería', icon: ImageIcon },
  { href: '/admin/servicios', label: 'Servicios', icon: Wrench },
  { href: '/admin/precios', label: 'Precios', icon: DollarSign },
  { href: '/admin/testimonios', label: 'Testimonios', icon: Star },
  { href: '/admin/config', label: 'Configuración', icon: Settings },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside style={{ width: 220, background: '#0d0d2b', borderRight: '1px solid rgba(0,180,255,0.1)', display: 'flex', flexDirection: 'column', padding: '24px 0', minHeight: '100vh', flexShrink: 0 }}>
      {/* Brand */}
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid rgba(0,180,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Music size={16} color="#00b4ff" />
          </div>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 3, background: 'linear-gradient(90deg,#00b4ff,#b44fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DJ ZULU
          </span>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 1, marginTop: 6, paddingLeft: 44 }}>ADMIN</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href) && href !== '/admin'
          const isActive = exact ? pathname === href : active

          return (
            <Link key={href} href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
                textDecoration: 'none', fontSize: 14, fontWeight: 600, letterSpacing: 0.5, transition: 'all 0.15s',
                background: isActive ? 'rgba(0,180,255,0.1)' : 'transparent',
                color: isActive ? '#00b4ff' : 'rgba(255,255,255,0.45)',
                border: isActive ? '1px solid rgba(0,180,255,0.2)' : '1px solid transparent',
              }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(0,180,255,0.08)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 10, paddingLeft: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {userEmail}
        </div>
        <button onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', transition: 'color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.borderColor = 'rgba(255,85,85,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'transparent' }}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
