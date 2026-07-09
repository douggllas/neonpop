import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { QUERY_CATEGORIA } from '@/lib/queries'
import { Artigo, Categoria } from '@/types'
import { GridArtigos } from '@/components/sections/GridArtigos'

interface Data { categoria: Categoria | null; artigos: Artigo[] }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = await sanityFetch<Data>(QUERY_CATEGORIA, { slug })
  const categoria = data?.categoria ?? null
  if (!categoria) return {}
  return { title: categoria.nome, description: `Todos os artigos de ${categoria.nome} no NEONPOP.` }
}

export default async function PaginaCategoria({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await sanityFetch<Data>(QUERY_CATEGORIA, { slug })
  const categoria = data?.categoria ?? null
  const artigos: Artigo[] = data?.artigos ?? []

  if (!categoria) notFound()

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-white text-sm font-bold px-4 py-2 rounded-full mb-3"
          style={{ backgroundColor: categoria.cor ?? '#1d4ed8' }}>
          {categoria.emoji} {categoria.nome}
        </div>
        <h1 className="text-3xl font-black font-serif text-slate-900">{categoria.nome}</h1>
        <p className="text-slate-500 mt-1">{artigos.length} artigos publicados</p>
      </div>

      {artigos.length > 0
        ? <GridArtigos artigos={artigos} colunas={3} />
        : <p className="text-slate-400 text-center py-20">Ainda não há artigos nesta categoria.</p>
      }
    </div>
  )
}
