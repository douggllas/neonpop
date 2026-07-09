import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Ticker } from '@/components/layout/Ticker'
import { sanityFetch } from '@/lib/sanity'
import { QUERY_CATEGORIAS, QUERY_TICKER } from '@/lib/queries'
import { Categoria, Artigo } from '@/types'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [categorias, tickerArtigos] = await Promise.all([
    sanityFetch<Categoria[]>(QUERY_CATEGORIAS).then(r => r ?? []),
    sanityFetch<Pick<Artigo, 'titulo' | 'slug'>[]>(QUERY_TICKER).then(r => r ?? []),
  ])

  return (
    <>
      <Header categorias={categorias} />
      {tickerArtigos.length > 0 && <Ticker artigos={tickerArtigos} />}
      <main>{children}</main>
      <Footer categorias={categorias} />
    </>
  )
}
