import { sanityFetch } from '@/lib/sanity'
import { QUERY_HOMEPAGE } from '@/lib/queries'
import { Artigo, Categoria } from '@/types'
import { Carousel } from '@/components/sections/Carousel'
import { SecaoDestaque } from '@/components/sections/SecaoDestaque'
import { GridArtigos } from '@/components/sections/GridArtigos'

interface HomepageData {
  destaques: Artigo[]
  recentes: Artigo[]
  categorias: Categoria[]
}

export default async function Homepage() {
  const data = await sanityFetch<HomepageData>(QUERY_HOMEPAGE)
  const destaques: Artigo[] = data?.destaques ?? []
  const recentes: Artigo[] = data?.recentes ?? []
  const categorias: Categoria[] = data?.categorias ?? []

  const porCategoria = categorias.map(cat => ({
    categoria: cat,
    artigos: recentes.filter(a => a.categoria?._id === cat._id),
  })).filter(g => g.artigos.length > 0)

  return (
    <>
      <Carousel artigos={destaques.length ? destaques : recentes.slice(0, 5)} />

      <div className="max-w-[1240px] mx-auto px-4 py-8">
        {porCategoria.map(({ categoria, artigos }) => (
          artigos.length >= 4 ? (
            <SecaoDestaque
              key={categoria._id}
              categoria={categoria}
              principal={artigos[0]}
              secundarios={artigos.slice(1, 4)}
            />
          ) : (
            <GridArtigos
              key={categoria._id}
              artigos={artigos}
              titulo={`${categoria.emoji ?? ''} ${categoria.nome}`}
            />
          )
        ))}

        {recentes.length > 0 && (
          <GridArtigos artigos={recentes.slice(0, 8)} titulo="Mais recentes" colunas={4} />
        )}
      </div>
    </>
  )
}
