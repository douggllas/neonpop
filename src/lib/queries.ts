const camposArtigo = `
  _id,
  titulo,
  slug,
  subtitulo,
  imagemDestacada { asset, alt, credit },
  categoria -> { _id, nome, slug, cor, emoji },
  autor -> { _id, nome },
  tags,
  publicadoEm,
  destaqueCapa,
  conteudoExclusivo
`

export const QUERY_HOMEPAGE = `{
  "destaques": *[_type == "artigo" && destaqueCapa == true] | order(publicadoEm desc) [0..4] {
    ${camposArtigo}
  },
  "recentes": *[_type == "artigo"] | order(publicadoEm desc) [0..11] {
    ${camposArtigo}
  },
  "categorias": *[_type == "categoria"] | order(nome asc) {
    _id, nome, slug, cor, emoji
  }
}`

export const QUERY_ARTIGO = `*[_type == "artigo" && slug.current == $slug][0] {
  ${camposArtigo},
  corpo,
  autor -> { _id, nome, foto { asset }, bio }
}`

export const QUERY_CATEGORIA = `{
  "categoria": *[_type == "categoria" && slug.current == $slug][0] {
    _id, nome, slug, cor, emoji
  },
  "artigos": *[_type == "artigo" && categoria->slug.current == $slug] | order(publicadoEm desc) {
    ${camposArtigo}
  }
}`

export const QUERY_CATEGORIAS = `*[_type == "categoria"] | order(nome asc) {
  _id, nome, slug, cor, emoji
}`

export const QUERY_TICKER = `*[_type == "artigo"] | order(publicadoEm desc) [0..7] {
  titulo, slug
}`
