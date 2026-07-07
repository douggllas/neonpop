'use client'

import Link from 'next/link'
import { Artigo } from '@/types'

export function Ticker({ artigos }: { artigos: Pick<Artigo, 'titulo' | 'slug'>[] }) {
  const items = [...artigos, ...artigos]

  return (
    <div className="bg-[#0f172a] border-b border-white/5 h-9 flex items-center overflow-hidden">
      <div
        className="shrink-0 bg-blue-600 text-white text-[0.6rem] font-black uppercase tracking-widest h-full flex items-center px-3 pr-5 z-10"
        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)' }}
      >
        Agora
      </div>
      <div
        className="flex-1 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
        }}
      >
        <div className="flex animate-ticker whitespace-nowrap hover:[animation-play-state:paused]">
          {items.map((a, i) => (
            <Link
              key={i}
              href={`/artigo/${a.slug.current}`}
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs px-8 transition-colors"
            >
              <span className="text-blue-400 text-[0.4rem]">●</span>
              {a.titulo}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
