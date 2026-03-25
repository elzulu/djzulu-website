import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'DJ Zulu — Events & Media | Medellín',
  description: 'Sets únicos para fiestas, eventos corporativos y shows en vivo. El mejor DJ de Medellín y Antioquia.',
  keywords: 'DJ Medellín, DJ para fiestas Medellín, DJ eventos Antioquia, DJ Zulu, DJ bodas Medellín',
  icons: {
    icon: '/logos/ChatGPT-Image-3-feb-2026_-12_50_28-p.m..ico',
  },
  openGraph: {
    title: 'DJ Zulu — Events & Media',
    description: 'Sets únicos para fiestas, eventos corporativos y shows en vivo.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d0d2b',
              color: '#fff',
              border: '1px solid rgba(0,180,255,0.3)',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '15px',
            },
          }}
        />
      </body>
    </html>
  )
}
