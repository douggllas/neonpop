import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['700', '900'] })

export const metadata: Metadata = {
  title: { default: 'NEONPOP', template: '%s · NEONPOP' },
  description: 'A cultura pop europeia em português. Música, ecrã, estilo, Eurovisão e muito mais.',
  openGraph: { siteName: 'NEONPOP', locale: 'pt_PT', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-slate-50 min-h-screen antialiased">{children}</body>
    </html>
  )
}
