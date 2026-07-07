import Link from 'next/link'
import { Artigo } from '@/types'
import { BadgeCategoria } from './BadgeCategoria'
import { ImagemSanity } from './ImagemSanity'

interface Props {
  artigo: Artigo
  variante?: 'padrao' | 'horizontal' | 'mini'
}

export function CardArtigo({ artigo, variante = 'padrao' }: Props) {
  const href = `/artigo/${artigo.slug.current}`
  const dataFormatada = new Date(artigo.publicadoEm).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  if (variante === 'horizontal') {
    return (
      <Link href={href} className="group flex gap-0 border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition-colors">
        <div className="w-28 min-w-28 overflow-hidden">
          {artigo.imagemDestacada
            ? <ImagemSanity imagem={artigo.imagemDestacada} width={120} height={90} className="w-full h-full object-cover min-h-[90px] group-hover:scale-105 transition-transform duration-500" />
            : <div className="w-full min-h-[90px] bg-gradient-to-br from-slate-800 to-blue-900" />
          }
        </div>
        <div className="flex flex-col justify-center gap-1 p-3">
          <BadgeCategoria categoria={artigo.categoria} />
          <h4 className="text-sm font-bold leading-snug text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
            {artigo.titulo}
          </h4>
          <span className="text-xs text-slate-400">{dataFormatada}</span>
        </div>
      </Link>
    )
  }

  if (variante === 'mini') {
    return (
      <Link href={href} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 block">
        <div className="overflow-hidden">
          {artigo.imagemDestacada
            ? <ImagemSanity imagem={artigo.imagemDestacada} width={400} height={220} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="w-full h-32 bg-gradient-to-br from-slate-800 to-blue-900" />
          }
        </div>
        <div className="p-3">
          <BadgeCategoria categoria={artigo.categoria} />
          <h4 className="mt-1.5 text-sm font-bold leading-snug text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
            {artigo.titulo}
          </h4>
          <span className="mt-1 block text-xs text-slate-400">{dataFormatada}</span>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 block">
      <div className="overflow-hidden">
        {artigo.imagemDestacada
          ? <ImagemSanity imagem={artigo.imagemDestacada} width={600} height={340} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-52 bg-gradient-to-br from-slate-800 to-blue-900" />
        }
      </div>
      <div className="p-4">
        <BadgeCategoria categoria={artigo.categoria} />
        <h3 className="mt-2 text-base font-bold leading-snug text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-3">
          {artigo.titulo}
        </h3>
        {artigo.subtitulo && (
          <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{artigo.subtitulo}</p>
        )}
        <span className="mt-2 block text-xs text-slate-400">{dataFormatada}</span>
      </div>
    </Link>
  )
}
