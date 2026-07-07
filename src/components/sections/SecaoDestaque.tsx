import Link from 'next/link'
import { Artigo, Categoria } from '@/types'
import { CardArtigo } from '@/components/ui/CardArtigo'

interface Props {
  categoria: Categoria
  principal: Artigo
  secundarios: Artigo[]
}

export function SecaoDestaque({ categoria, principal, secundarios }: Props) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">
          {categoria.emoji} {categoria.nome}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-transparent" />
        <Link href={`/categoria/${categoria.slug.current}`} className="text-[0.68rem] font-bold text-blue-600 uppercase tracking-wide hover:gap-1.5 transition-all flex items-center gap-1">
          Ver tudo →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-white">
          <CardArtigo artigo={principal} variante="padrao" />
        </div>
        <div className="bg-white flex flex-col">
          {secundarios.map(a => (
            <CardArtigo key={a._id} artigo={a} variante="horizontal" />
          ))}
        </div>
      </div>
    </section>
  )
}
