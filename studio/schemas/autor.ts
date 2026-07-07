import { defineField, defineType } from 'sanity'

export const autor = defineType({
  name: 'autor',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: r => r.required() }),
    defineField({ name: 'foto', title: 'Foto', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', title: 'Biografia', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'nome', media: 'foto' },
  },
})
