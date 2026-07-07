import { Artigo } from '@/types'
import { CardArtigo } from '@/components/ui/CardArtigo'

interface Props {
  artigos: Artigo[]
  titulo?: string
  colunas?: 2 | 3 | 4
}

export function GridArtigos({ artigos, titulo, colunas = 3 }: Props) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
  }[colunas]

  return (
    <section className="mb-8">
      {titulo && (
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">{titulo}</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-transparent" />
        </div>
      )}
      <div className={`grid ${gridCols} gap-4`}>
        {artigos.map(a => (
          <CardArtigo key={a._id} artigo={a} variante={colunas === 4 ? 'mini' : 'padrao'} />
        ))}
      </div>
    </section>
  )
}
