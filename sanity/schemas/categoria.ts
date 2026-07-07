import { defineField, defineType } from 'sanity'

export const categoria = defineType({
  name: 'categoria',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug', title: 'Slug (URL)', type: 'slug',
      options: { source: 'nome' }, validation: r => r.required(),
    }),
    defineField({ name: 'cor', title: 'Cor (hex)', type: 'string', initialValue: '#1d4ed8' }),
    defineField({ name: 'emoji', title: 'Emoji', type: 'string' }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `/${subtitle}` }),
  },
})
