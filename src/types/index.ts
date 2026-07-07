export interface Categoria {
  _id: string
  nome: string
  slug: { current: string }
  cor: string
  emoji?: string
}

export interface Autor {
  _id: string
  nome: string
  foto?: SanityImage
  bio?: string
}

export interface SanityImage {
  asset: { _ref: string }
  alt?: string
  credit?: string
}

export interface Artigo {
  _id: string
  titulo: string
  slug: { current: string }
  subtitulo?: string
  corpo?: any[]
  imagemDestacada?: SanityImage
  categoria: Categoria
  autor?: Autor
  tags?: string[]
  publicadoEm: string
  destaqueCapa?: boolean
  conteudoExclusivo?: boolean
}
