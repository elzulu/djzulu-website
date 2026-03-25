import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07071a' }}>
      <AdminSidebar userEmail={user.email ?? ''} />
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
