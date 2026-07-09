import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/lib/sanity'
import { QUERY_ARTIGO } from '@/lib/queries'
import { Artigo } from '@/types'
import { BadgeCategoria } from '@/components/ui/BadgeCategoria'
import { ImagemSanity } from '@/components/ui/ImagemSanity'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const artigo = await sanityFetch<Artigo>(QUERY_ARTIGO, { slug })
  if (!artigo) return {}
  return {
    title: artigo.titulo,
    description: artigo.subtitulo,
    openGraph: { title: artigo.titulo, description: artigo.subtitulo },
  }
}

export default async function PaginaArtigo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artigo = await sanityFetch<Artigo>(QUERY_ARTIGO, { slug })

  if (!artigo) notFound()

  const dataFormatada = new Date(artigo.publicadoEm).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <BadgeCategoria categoria={artigo.categoria} size="md" />
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          {artigo.titulo}
        </h1>
        {artigo.subtitulo && (
          <p className="mt-3 text-lg text-slate-500 leading-relaxed">{artigo.subtitulo}</p>
        )}
        <div className="flex items-center gap-3 mt-4 text-sm text-slate-400">
          {artigo.autor && <span className="font-semibold text-slate-600">Por {artigo.autor.nome}</span>}
          {artigo.autor && <span>·</span>}
          <time dateTime={artigo.publicadoEm}>{dataFormatada}</time>
        </div>
      </div>

      {artigo.imagemDestacada && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <ImagemSanity imagem={artigo.imagemDestacada} width={900} height={500} className="w-full object-cover" priority />
          {artigo.imagemDestacada.credit && (
            <p className="text-xs text-slate-400 mt-1.5 text-right">{artigo.imagemDestacada.credit}</p>
          )}
        </div>
      )}

      {artigo.corpo && (
        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-a:text-blue-600">
          <PortableText value={artigo.corpo} />
        </div>
      )}

      {artigo.tags && artigo.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap gap-2">
          {artigo.tags.map(tag => (
            <span key={tag} className="text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
