import { defineField, defineType } from 'sanity'

export const artigo = defineType({
  name: 'artigo',
  title: 'Artigo',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug', title: 'Slug (URL)', type: 'slug',
      options: { source: 'titulo' }, validation: r => r.required(),
    }),
    defineField({ name: 'subtitulo', title: 'Subtítulo / Linha de apoio', type: 'string' }),
    defineField({
      name: 'imagemDestacada', title: 'Imagem destacada', type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
        defineField({ name: 'credit', title: 'Crédito da foto', type: 'string' }),
      ],
    }),
    defineField({
      name: 'categoria', title: 'Categoria', type: 'reference',
      to: [{ type: 'categoria' }], validation: r => r.required(),
    }),
    defineField({
      name: 'autor', title: 'Autor', type: 'reference',
      to: [{ type: 'autor' }],
    }),
    defineField({
      name: 'corpo', title: 'Corpo do artigo', type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image', options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' }),
            defineField({ name: 'credit', type: 'string', title: 'Crédito' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'tags', title: 'Tags', type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publicadoEm', title: 'Data de publicação', type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({ name: 'destaqueCapa', title: 'Destaque na capa?', type: 'boolean', initialValue: false }),
    defineField({ name: 'conteudoExclusivo', title: 'Conteúdo exclusivo?', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Mais recente', name: 'publicadoEmDesc', by: [{ field: 'publicadoEm', direction: 'desc' }] }],
  preview: {
    select: { title: 'titulo', subtitle: 'categoria.nome', media: 'imagemDestacada' },
  },
})
