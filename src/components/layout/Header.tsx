'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Categoria } from '@/types'

export function Header({ categorias }: { categorias: Categoria[] }) {
  const [aberto, setAberto] = useState(false)

  return (
    <header className="bg-[#0a0f1e] sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-[1240px] mx-auto px-4 flex items-center h-14 gap-6">
        <Link href="/" className="font-serif text-2xl font-black text-white tracking-tight shrink-0">
          NEON<span className="text-blue-400">POP</span>
        </Link>

        <nav className="hidden md:flex flex-1 gap-0.5">
          {categorias.map(cat => (
            <Link
              key={cat._id}
              href={`/categoria/${cat.slug.current}`}
              className="text-white/50 hover:text-white text-[0.72rem] font-semibold uppercase tracking-wider px-3 h-14 flex items-center relative group transition-colors"
            >
              {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
              {cat.nome}
              <span
                className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                style={{ backgroundColor: cat.cor ?? '#3b82f6' }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <button className="hidden sm:block text-white/60 hover:text-white text-xs font-semibold border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/5 transition-all">
            Entrar
          </button>
          <button className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-1.5 transition-all hover:shadow-[0_0_0_4px_rgba(59,130,246,0.2)]">
            Subscrever
          </button>
          <button
            onClick={() => setAberto(!aberto)}
            className="md:hidden flex flex-col gap-1.5 p-1.5 ml-1"
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-200 ${aberto ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-200 ${aberto ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-200 ${aberto ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="md:hidden bg-[#0a0f1e] border-t border-white/5 px-4 py-2">
          {categorias.map(cat => (
            <Link
              key={cat._id}
              href={`/categoria/${cat.slug.current}`}
              onClick={() => setAberto(false)}
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold py-3 border-b border-white/5 last:border-0 transition-colors"
            >
              {cat.emoji && <span>{cat.emoji}</span>}
              {cat.nome}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
