'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Artigo } from '@/types'
import { BadgeCategoria } from '@/components/ui/BadgeCategoria'
import { ImagemSanity } from '@/components/ui/ImagemSanity'

export function Carousel({ artigos }: { artigos: Artigo[] }) {
  const [atual, setAtual] = useState(0)
  const [progresso, setProgresso] = useState(0)
  const total = artigos.length
  const INTERVALO = 6000

  const irPara = useCallback((idx: number) => {
    setAtual((idx + total) % total)
    setProgresso(0)
  }, [total])

  useEffect(() => {
    setProgresso(0)
    const timer = setTimeout(() => irPara(atual + 1), INTERVALO)
    const prog = setInterval(() => setProgresso(p => Math.min(p + 100 / (INTERVALO / 100), 100)), 100)
    return () => { clearTimeout(timer); clearInterval(prog) }
  }, [atual, irPara])

  if (!artigos.length) return null
  const artigo = artigos[atual]

  return (
    <div className="relative overflow-hidden bg-[#0a0f1e] select-none">
      <div className="relative h-[480px] sm:h-[560px]">
        {artigos.map((a, i) => (
          <div
            key={a._id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === atual ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {a.imagemDestacada
              ? <ImagemSanity imagem={a.imagemDestacada} width={1400} height={600} className="w-full h-full object-cover" priority={i === 0} />
              : <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#0f1f3d] to-blue-900" />
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-10 pb-14 sm:pb-16 max-w-3xl">
          <BadgeCategoria categoria={artigo.categoria} size="md" />
          <Link href={`/artigo/${artigo.slug.current}`}>
            <h1 className="mt-3 font-serif text-2xl sm:text-4xl font-black text-white leading-tight hover:text-blue-300 transition-colors">
              {artigo.titulo}
            </h1>
          </Link>
          {artigo.subtitulo && (
            <p className="mt-2 text-white/70 text-sm sm:text-base max-w-xl hidden sm:block">{artigo.subtitulo}</p>
          )}
          <Link
            href={`/artigo/${artigo.slug.current}`}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)]"
          >
            Ler artigo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <button onClick={() => irPara(atual - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-blue-600 hover:border-blue-600 transition-all text-lg flex items-center justify-center">‹</button>
        <button onClick={() => irPara(atual + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-blue-600 hover:border-blue-600 transition-all text-lg flex items-center justify-center">›</button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {artigos.map((_, i) => (
          <button
            key={i}
            onClick={() => irPara(i)}
            className={`rounded-full border-2 transition-all duration-200 ${i === atual ? 'w-4 h-2.5 bg-white border-white' : 'w-2.5 h-2.5 bg-white/30 border-white/50 hover:bg-white/60'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-100 z-20" style={{ width: `${progresso}%` }} />
    </div>
  )
}
