import Link from 'next/link'
import { Categoria } from '@/types'

interface Props {
  categoria: Categoria
  size?: 'sm' | 'md'
}

export function BadgeCategoria({ categoria, size = 'sm' }: Props) {
  const classes = size === 'sm'
    ? 'text-[0.6rem] px-2 py-0.5'
    : 'text-xs px-3 py-1'

  return (
    <Link
      href={`/categoria/${categoria.slug.current}`}
      className={`inline-flex items-center gap-1 rounded font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-80 ${classes}`}
      style={{ backgroundColor: categoria.cor ?? '#1d4ed8' }}
    >
      {categoria.emoji && <span>{categoria.emoji}</span>}
      {categoria.nome}
    </Link>
  )
}
