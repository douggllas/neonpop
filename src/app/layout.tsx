import type { Metadata } from 'next'
import { Oswald } from 'next/font/google'
import './globals.css'

const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: { default: 'NEONPOP', template: '%s · NEONPOP' },
  description: 'A cultura pop europeia em português. Música, ecrã, estilo, Eurovisão e muito mais.',
  openGraph: { siteName: 'NEONPOP', locale: 'pt_PT', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={oswald.variable}>
      <body className="font-sans bg-slate-50 min-h-screen antialiased">{children}</body>
    </html>
  )
}
